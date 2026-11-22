import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const fetchSavedSchemeCodes = async (
  userId: string | null | undefined
): Promise<{ savedCodes: string[]; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return { savedCodes: [] };
  }

  try {
    const { data, error } = await supabase
      .from('saved_schemes')
      .select(`
        scheme_id,
        schemes ( scheme_code )
      `)
      .eq('user_id', userId);

    if (error || !data) {
      return { savedCodes: [], error: error?.message };
    }

    const codes = data
      .map((row: any) => row.schemes?.scheme_code)
      .filter((code: any): code is string => Boolean(code));

    return { savedCodes: codes };
  } catch (err: any) {
    return { savedCodes: [], error: err.message };
  }
};

export const saveSchemeToDb = async (
  userId: string | null | undefined,
  schemeCode: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return { success: true }; // Handled in guest store
  }

  try {
    // Resolve scheme UUID from scheme_code
    const { data: schemeData } = await supabase
      .from('schemes')
      .select('id')
      .eq('scheme_code', schemeCode)
      .single();

    if (!schemeData) {
      return { success: false, error: "Scheme not found in database." };
    }

    const { error } = await supabase
      .from('saved_schemes')
      .insert({
        user_id: userId,
        scheme_id: schemeData.id
      });

    if (error && error.code !== '23505') { // Ignore duplicate key
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

export const removeSavedSchemeFromDb = async (
  userId: string | null | undefined,
  schemeCode: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return { success: true };
  }

  try {
    const { data: schemeData } = await supabase
      .from('schemes')
      .select('id')
      .eq('scheme_code', schemeCode)
      .single();

    if (!schemeData) return { success: true };

    const { error } = await supabase
      .from('saved_schemes')
      .delete()
      .eq('user_id', userId)
      .eq('scheme_id', schemeData.id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
