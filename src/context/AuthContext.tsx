import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile, getStoredUserProfile, saveUserProfile } from '../services/userService';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  isPasswordRecoveryMode: boolean;
  setRememberMe: (val: boolean) => void;
  signIn: (email: string, password: string, remember?: boolean) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, fullName: string, remember?: boolean) => Promise<{ success: boolean; error?: string; message?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInAsDemo: () => void;
  dismissPasswordRecovery: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_STORAGE_KEY = 'sabevia_demo_session';
const REMEMBER_ME_KEY = 'sabevia_remember_me';

function getInitialRememberMe(): boolean {
  try {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(REMEMBER_ME_KEY);
      return stored !== 'false'; // default true
    }
  } catch {
    // Ignore
  }
  return true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile>(() => getStoredUserProfile());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [rememberMe, setRememberMeState] = useState<boolean>(getInitialRememberMe);
  const [isPasswordRecoveryMode, setIsPasswordRecoveryMode] = useState<boolean>(false);

  const setRememberMe = useCallback((val: boolean) => {
    setRememberMeState(val);
    try {
      window.localStorage.setItem(REMEMBER_ME_KEY, String(val));
    } catch {
      // Ignore
    }
  }, []);

  const syncProfileFromUser = useCallback((currentUser: User | null) => {
    if (!currentUser) {
      return;
    }
    const meta = currentUser.user_metadata || {};
    const fullName = meta.full_name || meta.name || currentUser.email?.split('@')[0] || 'Member';
    const firstName = fullName.split(' ')[0] || fullName;
    const email = currentUser.email || '';
    const avatarUrl = meta.avatar_url || meta.picture;
    const avatarLetter = (firstName[0] || 'M').toUpperCase();

    const newProfile: UserProfile = {
      id: currentUser.id,
      fullName,
      firstName,
      email,
      avatarLetter,
      avatarUrl,
    };

    setProfile(newProfile);
    saveUserProfile(newProfile);
  }, []);

  // Initialize auth state
  useEffect(() => {
    let isMounted = true;
    const client = getSupabaseClient();

    // Check if URL contains password recovery hash
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      if (hash.includes('type=recovery') || hash.includes('reset-password')) {
        setIsPasswordRecoveryMode(true);
      }
    }

    async function initSession() {
      setIsLoading(true);

      // 1. Try Supabase session if configured
      if (client && isSupabaseConfigured()) {
        try {
          const { data: { session: currentSession }, error } = await client.auth.getSession();
          if (!error && currentSession?.user && isMounted) {
            setSession(currentSession);
            setUser(currentSession.user);
            syncProfileFromUser(currentSession.user);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Error reading Supabase session:', err);
        }
      }

      // 2. Try demo/local session fallback
      try {
        const storedDemo =
          window.localStorage.getItem(DEMO_STORAGE_KEY) ||
          window.sessionStorage.getItem(DEMO_STORAGE_KEY);
        if (storedDemo && isMounted) {
          const parsed = JSON.parse(storedDemo);
          if (parsed && parsed.email) {
            const fakeUser: Partial<User> = {
              id: parsed.id || 'demo-user-1',
              email: parsed.email,
              user_metadata: { full_name: parsed.fullName || parsed.name || 'Alex Brown' },
              app_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString(),
            };
            setUser(fakeUser as User);
            syncProfileFromUser(fakeUser as User);
          }
        }
      } catch {
        // Ignore
      }

      if (isMounted) {
        setIsLoading(false);
      }
    }

    initSession();

    // Subscribe to auth state changes from Supabase
    let subscription: { unsubscribe: () => void } | null = null;
    if (client) {
      try {
        const { data } = client.auth.onAuthStateChange((event, newSession) => {
          if (!isMounted) return;

          if (event === 'PASSWORD_RECOVERY') {
            setIsPasswordRecoveryMode(true);
          }

          if (newSession?.user) {
            setSession(newSession);
            setUser(newSession.user);
            syncProfileFromUser(newSession.user);
          } else if (event === 'SIGNED_OUT') {
            setSession(null);
            setUser(null);
            window.localStorage.removeItem(DEMO_STORAGE_KEY);
            window.sessionStorage.removeItem(DEMO_STORAGE_KEY);
          }
        });
        subscription = data.subscription;
      } catch {
        // Ignore
      }
    }

    return () => {
      isMounted = false;
      if (subscription) subscription.unsubscribe();
    };
  }, [syncProfileFromUser]);

  // Sign In with email & password
  const signIn = async (
    email: string,
    password: string,
    remember: boolean = true
  ): Promise<{ success: boolean; error?: string }> => {
    setRememberMe(remember);
    const client = getSupabaseClient();

    if (!client || !isSupabaseConfigured()) {
      // Offline / Demo fallback when Supabase backend is not configured
      const fullName = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Sabevia Scholar';
      const demoUser: Partial<User> = {
        id: `local-${Date.now()}`,
        email,
        user_metadata: { full_name: fullName },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      setUser(demoUser as User);
      syncProfileFromUser(demoUser as User);

      const targetStorage = remember ? window.localStorage : window.sessionStorage;
      targetStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ email, fullName, id: demoUser.id }));

      return { success: true };
    }

    try {
      const { data, error } = await client.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        syncProfileFromUser(data.user);
        return { success: true };
      }

      return { success: false, error: 'Sign in failed. Please check your credentials.' };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Network error during sign in.' };
    }
  };

  // Sign Up with email, password, full name
  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    remember: boolean = true
  ): Promise<{ success: boolean; error?: string; message?: string }> => {
    setRememberMe(remember);
    const client = getSupabaseClient();

    if (!client || !isSupabaseConfigured()) {
      // Local fallback
      const cleanName = fullName.trim() || email.split('@')[0];
      const demoUser: Partial<User> = {
        id: `local-${Date.now()}`,
        email,
        user_metadata: { full_name: cleanName },
        app_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      setUser(demoUser as User);
      syncProfileFromUser(demoUser as User);

      const targetStorage = remember ? window.localStorage : window.sessionStorage;
      targetStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ email, fullName: cleanName, id: demoUser.id }));

      return { success: true, message: 'Account created successfully!' };
    }

    try {
      const { data, error } = await client.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        setUser(data.user);
        setSession(data.session);
        syncProfileFromUser(data.user);
        return { success: true, message: 'Account created and signed in!' };
      }

      if (data.user && !data.session) {
        return {
          success: true,
          message: 'Account created! Please check your email to confirm your registration.',
        };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to create account.' };
    }
  };

  // Sign Out
  const signOut = async (): Promise<void> => {
    const client = getSupabaseClient();
    try {
      if (client) {
        await client.auth.signOut();
      }
    } catch (err) {
      console.warn('Error during Supabase signOut:', err);
    } finally {
      setUser(null);
      setSession(null);
      try {
        window.localStorage.removeItem(DEMO_STORAGE_KEY);
        window.sessionStorage.removeItem(DEMO_STORAGE_KEY);
      } catch {
        // Ignore
      }
    }
  };

  // Reset Password for Email
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      return {
        success: true,
      };
    }

    try {
      const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}#reset-password`,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to send password recovery email.' };
    }
  };

  // Update Password (from recovery mode)
  const updatePassword = async (newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      setIsPasswordRecoveryMode(false);
      return { success: true };
    }

    try {
      const { error } = await client.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      setIsPasswordRecoveryMode(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to update password.' };
    }
  };

  // Google OAuth
  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    const client = getSupabaseClient();
    if (!client || !isSupabaseConfigured()) {
      // Demo Google Sign In
      const googleUser: Partial<User> = {
        id: `google-${Date.now()}`,
        email: 'alex.brown@sabevia.com',
        user_metadata: {
          full_name: 'Alex Brown',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        },
        app_metadata: { provider: 'google' },
        aud: 'authenticated',
        created_at: new Date().toISOString(),
      };
      setUser(googleUser as User);
      syncProfileFromUser(googleUser as User);
      window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(googleUser));
      return { success: true };
    }

    try {
      const { error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Google sign in failed.' };
    }
  };

  // Instant Demo Sign In
  const signInAsDemo = () => {
    const demoUser: Partial<User> = {
      id: 'demo-user-alex',
      email: 'alex.brown@sabevia.com',
      user_metadata: { full_name: 'Alex Brown' },
      app_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };
    setUser(demoUser as User);
    syncProfileFromUser(demoUser as User);
    window.localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demoUser));
  };

  const dismissPasswordRecovery = () => {
    setIsPasswordRecoveryMode(false);
    if (window.location.hash.includes('reset-password')) {
      window.location.hash = '#/dashboard';
    }
  };

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAuthenticated,
        isLoading,
        rememberMe,
        isPasswordRecoveryMode,
        setRememberMe,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        signInWithGoogle,
        signInAsDemo,
        dismissPasswordRecovery,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
