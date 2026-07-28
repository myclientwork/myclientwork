'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { UserProfile } from '@/lib/types';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

function cleanOAuthParams() {
  if (typeof window === 'undefined') return;
  // Never strip query/hash parameters on callback or reset-password routes!
  if (
    window.location.pathname.startsWith('/auth/callback') ||
    window.location.pathname.startsWith('/auth/reset-password')
  ) {
    return;
  }

  const { search, hash, pathname } = window.location;
  let needsClean = false;

  // Check for OAuth query params (code=, error=, state=)
  if (search.includes('code=') || search.includes('error=')) {
    needsClean = true;
  }

  // Check for OAuth hash fragments (access_token=, refresh_token=)
  if (hash.includes('access_token=') || hash.includes('refresh_token=')) {
    needsClean = true;
  }

  if (needsClean) {
    // Small delay to let Supabase SDK detect and consume the tokens first
    setTimeout(() => {
      const stateObj = window.history.state ?? {};
      window.history.replaceState(stateObj, '', pathname);
    }, 100);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const profileCache = useRef<{ [id: string]: UserProfile | null }>({});

  const loadProfile = useCallback(async (userObj: User) => {
    const userId = userObj.id;
    if (profileCache.current[userId]) {
      setProfile(profileCache.current[userId]);
      return profileCache.current[userId];
    }

    // Try fetching existing profile
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (data) {
      const fetchedProfile = data as UserProfile;
      profileCache.current[userId] = fetchedProfile;
      setProfile(fetchedProfile);
      return fetchedProfile;
    }

    // First-time OAuth user (e.g. mobile Google sign-in) — auto-create profile
    const fullName =
      userObj.user_metadata?.full_name ||
      userObj.user_metadata?.name ||
      userObj.email?.split('@')[0] ||
      'User';

    const avatarUrl =
      userObj.user_metadata?.avatar_url ||
      userObj.user_metadata?.picture ||
      null;

    const { error: insertError } = await supabase.from('user_profiles').insert({
      id: userId,
      email: userObj.email!,
      full_name: fullName,
      avatar_url: avatarUrl,
    });

    if (insertError) {
      console.error('Auto profile creation error:', insertError);
    }

    // Fetch again or construct profile
    const { data: newProfileData } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    const createdProfile: UserProfile = (newProfileData as UserProfile | null) ?? {
      id: userId,
      email: userObj.email!,
      full_name: fullName,
      avatar_url: avatarUrl,
      phone: null,
      company: null,
      country: null,
      role: 'user',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    profileCache.current[userId] = createdProfile;
    setProfile(createdProfile);
    return createdProfile;
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      delete profileCache.current[user.id];
      await loadProfile(user);
    }
  }, [user, loadProfile]);

  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        cleanOAuthParams();
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setSession(initialSession);
        const initialUser = initialSession?.user ?? null;
        setUser(initialUser);
        setLoading(false);

        if (initialUser) {
          loadProfile(initialUser).catch((e) => {
            console.warn('Error loading initial profile:', e);
          });
        }
      } catch (err) {
        console.error('Error fetching initial session:', err);
        if (isMounted) setLoading(false);
      } finally {
        cleanOAuthParams();
      }
    }

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      if (!isMounted) return;

      // Handle Password Recovery flow event
      if (event === 'PASSWORD_RECOVERY') {
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth/reset-password')) {
          window.location.href = '/auth/reset-password';
          return;
        }
      }

      cleanOAuthParams();
      setSession(currentSession);
      const newUser = currentSession?.user ?? null;
      setUser(newUser);
      setLoading(false);

      if (newUser) {
        loadProfile(newUser).catch((e) => {
          console.warn('Error loading profile on auth change:', e);
        });
      } else {
        setProfile(null);
      }
      cleanOAuthParams();
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  }, []);

  const contextValue = useMemo(() => ({
    user,
    session,
    profile,
    loading,
    isAdmin: profile?.role === 'admin',
    signOut,
    refreshProfile,
  }), [user, session, profile, loading, signOut, refreshProfile]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
