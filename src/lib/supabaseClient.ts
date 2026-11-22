import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

const getEnvVar = (key: string): string => {
  const meta = (import.meta as any)?.env?.[key];
  if (meta) return meta;
  if (typeof process !== 'undefined' && process.env?.[key]) {
    return process.env[key] as string;
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');
export const storageBucketName = getEnvVar('VITE_SUPABASE_STORAGE_BUCKET') || 'user-documents';

/**
 * Validates whether Supabase credentials have been configured with real project values.
 */
export const isSupabaseConfigured = (): boolean => {
  return (
    Boolean(supabaseUrl) &&
    Boolean(supabaseAnonKey) &&
    !supabaseUrl.includes('your-project.supabase.co') &&
    !supabaseAnonKey.includes('your-anon-key-here') &&
    supabaseUrl.startsWith('https://')
  );
};

// Fallback dummy client for guest mode when credentials are not yet configured in local environment
const dummyUrl = 'https://placeholder-project.supabase.co';
const dummyKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy-token';

/**
 * Singleton Supabase Client with strict Database typing.
 * Never initialize with or expose the Supabase service-role key in frontend client bundles.
 */
export const supabase: SupabaseClient<Database> = createClient<Database>(
  isSupabaseConfigured() ? supabaseUrl : dummyUrl,
  isSupabaseConfigured() ? supabaseAnonKey : dummyKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storageKey: 'sahayak-auth-session'
    }
  }
);
