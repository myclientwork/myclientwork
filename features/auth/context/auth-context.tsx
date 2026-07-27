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

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!isMounted) return;
      setSession(currentSession);
      const newUser = currentSession?.user ?? null;
      setUser(newUser);

      if (newUser) {
        await loadProfile(newUser);
      } else {
        setProfile(null);
      }
      if (isMounted) setLoading(false);

      // Clean up URL hash if access_token is present in URL (mobile implicit flow)
      if (typeof window !== 'undefined' && window.location.hash.includes('access_token=')) {
        setTimeout(() => {
          if (window.location.hash.includes('access_token=')) {
            window.history.replaceState(null, '', window.location.pathname + window.location.search);
          }
        }, 300);
      }
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
