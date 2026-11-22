import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { UserProfile } from '../types';

/**
 * Fetch household members for an authenticated user.
 * In guest mode or when unconfigured, returns empty array safely.
 */
export const fetchHouseholdMembersFromDb = async (
  userId: string | null | undefined
): Promise<{ members: UserProfile[]; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return { members: [] };
  }

  try {
    const { data, error } = await supabase
      .from('household_members')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error || !data) {
      return { members: [], error: error?.message };
    }

    const members: UserProfile[] = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      relation: (row.relation as any) || 'self',
      age: Number(row.age) || 18,
      gender: (row.gender as any) || 'other',
      occupation: row.occupation || 'other',
      state: row.state || 'Karnataka',
      district: row.district || 'Mandya',
      socialCategory: row.social_category || 'general',
      landholdingAcres: Number(row.landholding_acres) || 0,
      annualIncome: Number(row.annual_income) || 0,
      isAadhaarLinkedBank: Boolean(row.is_aadhaar_linked_bank),
      isDigiLockerLinked: Boolean(row.is_digilocker_linked)
    }));

    return { members };
  } catch (err: any) {
    return { members: [], error: err.message };
  }
};

/**
 * Insert a new household member record in Supabase.
 */
export const createHouseholdMemberInDb = async (
  userId: string | null | undefined,
  member: Omit<UserProfile, 'id'>
): Promise<{ success: boolean; member?: UserProfile; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return {
      success: true,
      member: { ...member, id: `local-prof-${Date.now()}` }
    };
  }

  try {
    const { data, error } = await supabase
      .from('household_members')
      .insert({
        user_id: userId,
        name: member.name,
        relation: member.relation,
        age: member.age,
        gender: member.gender,
        occupation: member.occupation,
        state: member.state,
        district: member.district,
        social_category: member.socialCategory,
        landholding_acres: member.landholdingAcres,
        annual_income: member.annualIncome,
        is_aadhaar_linked_bank: member.isAadhaarLinkedBank,
        is_digilocker_linked: member.isDigiLockerLinked
      })
      .select()
      .single();

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to add household member." };
    }

    const created: UserProfile = {
      id: data.id,
      name: data.name,
      relation: (data.relation as any) || 'self',
      age: data.age,
      gender: (data.gender as any) || 'other',
      occupation: data.occupation,
      state: data.state,
      district: data.district || '',
      socialCategory: (data.social_category as any) || 'general',
      landholdingAcres: Number(data.landholding_acres),
      annualIncome: Number(data.annual_income),
      isAadhaarLinkedBank: data.is_aadhaar_linked_bank,
      isDigiLockerLinked: data.is_digilocker_linked
    };

    return { success: true, member: created };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};

/**
 * Remove a household member record from Supabase.
 */
export const deleteHouseholdMemberFromDb = async (
  userId: string | null | undefined,
  memberId: string
): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('household_members')
      .delete()
      .eq('id', memberId)
      .eq('user_id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
