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

  const loadProfile = useCallback(async (userId: string) => {
    if (profileCache.current[userId] !== undefined) {
      setProfile(profileCache.current[userId]);
      return;
    }
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
    const fetchedProfile = data as UserProfile | null;
    profileCache.current[userId] = fetchedProfile;
    setProfile(fetchedProfile);
  }, []);

  const refreshProfile = useCallback(async () => {
    if (user) {
      delete profileCache.current[user.id];
      await loadProfile(user.id);
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
        await loadProfile(newUser.id);
      } else {
        setProfile(null);
      }
      if (isMounted) setLoading(false);
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
