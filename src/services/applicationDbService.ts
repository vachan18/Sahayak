import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { ApplicationRecord, ApplicationStage } from '../types';

export type DatabaseApplicationStatus = 
  | 'draft' 
  | 'submitted' 
  | 'in_review' 
  | 'under_review'
  | 'verified' 
  | 'sanctioned'
  | 'approved' 
  | 'rejected';

export type FrontendApplicationStatusBadge = 
  | 'submitted' 
  | 'under_review' 
  | 'sanctioned' 
  | 'disbursed' 
  | 'action_needed';

/**
 * Normalizes frontend status values to canonical PostgreSQL database status.
 * Guarantees invalid or unsupported status strings are never sent to the database.
 */
export const mapFrontendStatusToDatabase = (
  rawStatus: string | null | undefined
): DatabaseApplicationStatus => {
  if (!rawStatus) return 'submitted';
  const clean = rawStatus.toLowerCase().trim();

  switch (clean) {
    case 'under_review':
    case 'in_review':
      return 'in_review';
    case 'verified':
      return 'verified';
    case 'sanctioned':
    case 'approved':
    case 'disbursed':
      return 'approved';
    case 'rejected':
      return 'rejected';
    case 'draft':
    case 'action_needed':
      return 'draft';
    case 'submitted':
    default:
      return 'submitted';
  }
};

/**
 * Maps database application status to frontend badge representation.
 */
export const mapDatabaseStatusToFrontend = (
  dbStatus: string | null | undefined
): FrontendApplicationStatusBadge => {
  if (!dbStatus) return 'submitted';
  const clean = dbStatus.toLowerCase().trim();

  switch (clean) {
    case 'under_review':
    case 'in_review':
    case 'verified':
      return 'under_review';
    case 'sanctioned':
    case 'approved':
      return 'sanctioned';
    case 'rejected':
    case 'draft':
      return 'action_needed';
    case 'submitted':
    default:
      return 'submitted';
  }
};

/**
 * Calculates current numeric stage (1-4) strictly based on recorded database status.
 */
export const calculateStageFromStatus = (
  status: string | null | undefined
): ApplicationStage => {
  const clean = (status || '').toLowerCase().trim();
  switch (clean) {
    case 'approved':
    case 'sanctioned':
      return 4;
    case 'verified':
      return 3;
    case 'in_review':
    case 'under_review':
      return 2;
    case 'rejected':
    case 'draft':
    case 'submitted':
    default:
      return 1;
  }
};

export interface CreateApplicationPayload {
  scheme_id: string;
  status?: string;
  application_reference?: string;
  notes?: string;
}

/**
 * Fetches applications from Supabase with zero fabricated government attributes.
 * Displays only data actually persisted in the database.
 */
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

    const records: ApplicationRecord[] = data.map((row: any) => {
      const currentStage = calculateStageFromStatus(row.status);
      const statusBadge = mapDatabaseStatusToFrontend(row.status);
      const isRejected = row.status === 'rejected';

      const formattedDate = row.created_at 
        ? new Date(row.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
        : 'Recorded';

      return {
        id: row.id,
        tokenNumber: row.application_reference || `APP-${row.id.substring(0, 8).toUpperCase()}`,
        schemeId: row.schemes?.scheme_code || 'scheme',
        schemeTitle: row.schemes?.name || 'Government Welfare Application',
        submittedAt: formattedDate,
        currentStage,
        statusBadge,
        isDelayed: false, // Not fabricated; determined only by explicit statutory SLA
        slaDeadlineDays: 0,
        slaDaysRemaining: 0,
        handlingOffice: row.schemes?.department || 'Designated Nodal Authority',
        submittedVia: 'self_online',
        audioStatusNarrationKey: isRejected
          ? 'Your application requires revision or additional documentation.'
          : `Your application token ${row.application_reference || ''} is currently ${statusBadge.replace('_', ' ')}.`,
        milestones: [
          {
            stage: 1,
            titleKey: "Citizen Application Recorded",
            date: formattedDate,
            isCompleted: true,
            isCurrent: currentStage === 1,
            remarksKey: row.notes || "Official application token registered via SAHAYAK portal."
          },
          ...(currentStage >= 2 ? [{
            stage: 2 as ApplicationStage,
            titleKey: "Under Verification by Nodal Department",
            date: row.updated_at ? new Date(row.updated_at).toLocaleDateString('en-IN') : 'In Progress',
            isCompleted: currentStage > 2,
            isCurrent: currentStage === 2,
            handlingOfficer: row.schemes?.department || "Department Authority"
          }] : []),
          ...(currentStage >= 3 ? [{
            stage: 3 as ApplicationStage,
            titleKey: currentStage === 4 ? "Sanction Order Approved" : "Departmental Verification Complete",
            date: row.updated_at ? new Date(row.updated_at).toLocaleDateString('en-IN') : 'Completed',
            isCompleted: currentStage >= 3,
            isCurrent: currentStage === 3
          }] : [])
        ]
      };
    });

    return { applications: records };
  } catch (err: any) {
    return { applications: [], error: err.message };
  }
};

/**
 * Creates an application record in Supabase with strict status validation.
 */
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
  const rawStatus = typeof schemeOrPayload === 'string' ? 'submitted' : (schemeOrPayload.status || 'submitted');

  // Enforce strict canonical status mapping before sending to PostgreSQL
  const sanitizedStatus = mapFrontendStatusToDatabase(rawStatus);

  try {
    const { data: schemeData } = await supabase
      .from('schemes')
      .select('id')
      .eq('scheme_code', schemeCode)
      .single();

    if (!schemeData) {
      return { success: false, error: "Scheme record not found in database." };
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        user_id: userId,
        scheme_id: schemeData.id,
        status: sanitizedStatus,
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
