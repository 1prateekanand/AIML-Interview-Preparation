import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://ntmxnvoomvuvdrszydot.supabase.co';

/**
 * Get the Supabase Project URL from environment or fallback default.
 */
export function getSupabaseUrl(): string {
  const envUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  return envUrl || DEFAULT_SUPABASE_URL;
}

/**
 * Get the Publishable / Anon Key from environment or localStorage override.
 */
export function getSupabasePublishableKey(): string {
  // Check runtime override in localStorage first (allows testing in-browser)
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const runtimeKey = window.localStorage.getItem('codenexus_supabase_publishable_key')?.trim();
      if (runtimeKey) return runtimeKey;
    }
  } catch {
    // Ignore storage restriction
  }

  // Check Vite environment variables
  const envKey = (
    (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
    (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)
  )?.trim();

  return envKey || '';
}

/**
 * Checks if a valid publishable key has been configured.
 */
export function isSupabaseConfigured(): boolean {
  const key = getSupabasePublishableKey();
  return !!key && key.length > 10;
}

/**
 * Helper to update publishable key at runtime (e.g. from UI modal or banner).
 */
export function setRuntimePublishableKey(key: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (key.trim()) {
        window.localStorage.setItem('codenexus_supabase_publishable_key', key.trim());
      } else {
        window.localStorage.removeItem('codenexus_supabase_publishable_key');
      }
    }
  } catch {
    // Ignore
  }
}

let cachedClient: SupabaseClient | null = null;
let lastUsedKey: string = '';
let lastUsedUrl: string = '';

/**
 * Returns a configured Supabase client singleton, or null if key is missing.
 */
export function getSupabaseClient(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getSupabasePublishableKey();

  if (!url || !key) {
    return null;
  }

  if (cachedClient && lastUsedUrl === url && lastUsedKey === key) {
    return cachedClient;
  }

  try {
    cachedClient = createClient(url, key, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    lastUsedUrl = url;
    lastUsedKey = key;
    return cachedClient;
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err);
    return null;
  }
}

/**
 * Direct client export initialized with current env vars.
 */
export const supabase = getSupabaseClient();
