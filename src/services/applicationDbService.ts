import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { ApplicationRecord, ApplicationStage } from '../types';

export interface CreateApplicationPayload {
  scheme_id: string;
  status?: string;
  application_reference?: string;
  notes?: string;
}

export const fetchApplicationsFromDb = async (
  userId: string | null | undefined
): Promise<{ applications: ApplicationRecord[]; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return { applications: [] };
  }

  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        id,
        user_id,
        scheme_id,
        status,
        application_reference,
        notes,
        created_at,
        updated_at,
        schemes ( scheme_code, name, department )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return { applications: [], error: error?.message };
    }

    const records: ApplicationRecord[] = data.map((row: any) => ({
      id: row.id,
      tokenNumber: row.application_reference || `APP-${row.id.substring(0, 8).toUpperCase()}`,
      schemeId: row.schemes?.scheme_code || 'pm-kisan',
      schemeTitle: row.schemes?.name || 'Government Scheme Application',
      submittedAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : '2026-11-22',
      currentStage: (row.status === 'approved' ? 4 : row.status === 'in_review' ? 2 : 1) as ApplicationStage,
      statusBadge: (row.status === 'approved' ? 'sanctioned' : row.status === 'in_review' ? 'under_review' : 'submitted') as any,
      isDelayed: false,
      slaDeadlineDays: 21,
      slaDaysRemaining: 14,
      handlingOffice: row.schemes?.department || 'District Authority',
      submittedVia: 'self_online',
      audioStatusNarrationKey: 'Your application is currently under statutory review.',
      milestones: [
        {
          stage: 1,
          titleKey: "Application Form Generated",
          date: row.created_at ? new Date(row.created_at).toLocaleDateString() : '',
          isCompleted: true,
          isCurrent: false,
          remarksKey: row.notes || "Official application token created."
        }
      ]
    }));

    return { applications: records };
  } catch (err: any) {
    return { applications: [], error: err.message };
  }
};

export const createApplicationInDb = async (
  userId: string | null | undefined,
  schemeOrPayload: string | CreateApplicationPayload,
  referenceNumber?: string,
  notes?: string
): Promise<{ success: boolean; application?: any; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return { success: true }; // Handled locally in guest mode
  }

  const schemeCode = typeof schemeOrPayload === 'string' ? schemeOrPayload : schemeOrPayload.scheme_id;
  const ref = typeof schemeOrPayload === 'string' ? referenceNumber : schemeOrPayload.application_reference;
  const noteText = typeof schemeOrPayload === 'string' ? notes : schemeOrPayload.notes;
  const appStatus = typeof schemeOrPayload === 'string' ? 'submitted' : (schemeOrPayload.status || 'submitted');

  try {
    const { data: schemeData } = await supabase
      .from('schemes')
      .select('id')
      .eq('scheme_code', schemeCode)
      .single();

    if (!schemeData) {
      return { success: false, error: "Scheme record not found." };
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        scheme_id: schemeData.id,
        status: appStatus as any,
        application_reference: ref || `SAH-${Math.floor(100000 + Math.random() * 900000)}`,
        notes: noteText || "Application registered via SAHAYAK welfare portal."
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, application: data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
};
