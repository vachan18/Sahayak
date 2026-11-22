import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { Database } from '../types/database.types';

export type DbProfile = Database['public']['Tables']['profiles']['Row'];
export type UpdateProfileInput = Database['public']['Tables']['profiles']['Update'];

export const fetchUserProfile = async (userId: string): Promise<{ profile: DbProfile | null; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return { profile: null };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      return { profile: null, error: error.message };
    }

    return { profile: data };
  } catch (err: any) {
    return { profile: null, error: err.message || "Failed to load profile." };
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: UpdateProfileInput
): Promise<{ success: boolean; profile?: DbProfile | null; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return { success: false, error: "Backend not configured or user unauthenticated." };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .maybeSingle();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, profile: data };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to update profile." };
  }
};
