import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id?: string;
  fullName: string;
  firstName: string;
  email: string;
  avatarLetter: string;
  avatarUrl?: string;
}

const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Alex Brown',
  firstName: 'Alex',
  email: 'alex.brown@sabevia.com',
  avatarLetter: 'A',
};

export function getStoredUserProfile(): UserProfile {
  try {
    const saved = localStorage.getItem('sabevia_user') || localStorage.getItem('codenexus_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        const fullName = parsed.fullName || parsed.name || DEFAULT_PROFILE.fullName;
        const firstName = parsed.firstName || fullName.split(' ')[0] || DEFAULT_PROFILE.firstName;
        const email = parsed.email || DEFAULT_PROFILE.email;
        const avatarLetter = (firstName[0] || 'A').toUpperCase();
        return {
          id: parsed.id,
          fullName,
          firstName,
          email,
          avatarLetter,
          avatarUrl: parsed.avatarUrl || parsed.picture,
        };
      }
    }
  } catch {
    // Ignore storage issues
  }
  return DEFAULT_PROFILE;
}

export function saveUserProfile(profile: Partial<UserProfile>): void {
  try {
    const current = getStoredUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem('sabevia_user', JSON.stringify(updated));
    window.dispatchEvent(new Event('sabevia_user_updated'));
  } catch {
    // Ignore
  }
}

export function useUserProfile(): UserProfile {
  const [profile, setProfile] = useState<UserProfile>(() => getStoredUserProfile());

  useEffect(() => {
    // 1. Check active Supabase auth session if available
    let isMounted = true;

    async function checkSupabaseAuth() {
      if (!supabase) return;
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          const user = session.user;
          const meta = user.user_metadata || {};
          const fullName = meta.full_name || meta.name || user.email?.split('@')[0] || DEFAULT_PROFILE.fullName;
          const firstName = fullName.split(' ')[0] || DEFAULT_PROFILE.firstName;
          const email = user.email || DEFAULT_PROFILE.email;
          const avatarUrl = meta.avatar_url || meta.picture;
          const avatarLetter = (firstName[0] || 'A').toUpperCase();

          setProfile({
            id: user.id,
            fullName,
            firstName,
            email,
            avatarLetter,
            avatarUrl,
          });
        }
      } catch {
        // Fallback to local profile
      }
    }

    checkSupabaseAuth();

    // 2. Listen to Supabase auth changes
    let authListener: { unsubscribe: () => void } | null = null;
    if (supabase) {
      try {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session?.user && isMounted) {
            const user = session.user;
            const meta = user.user_metadata || {};
            const fullName = meta.full_name || meta.name || user.email?.split('@')[0] || DEFAULT_PROFILE.fullName;
            const firstName = fullName.split(' ')[0] || DEFAULT_PROFILE.firstName;
            const email = user.email || DEFAULT_PROFILE.email;
            const avatarUrl = meta.avatar_url || meta.picture;
            const avatarLetter = (firstName[0] || 'A').toUpperCase();

            setProfile({
              id: user.id,
              fullName,
              firstName,
              email,
              avatarLetter,
              avatarUrl,
            });
          }
        });
        authListener = subscription;
      } catch {
        // Ignore
      }
    }

    // 3. Listen to local updates
    const handleLocalUpdate = () => {
      setProfile(getStoredUserProfile());
    };
    window.addEventListener('sabevia_user_updated', handleLocalUpdate);

    return () => {
      isMounted = false;
      if (authListener) authListener.unsubscribe();
      window.removeEventListener('sabevia_user_updated', handleLocalUpdate);
    };
  }, []);

  return profile;
}
