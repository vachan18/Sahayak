import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { AssessmentAnswers } from './eligibilityEngine';
import { EligibilityAssessmentResult, SchemeEvaluationOutcome } from '../types';

export interface SavedAssessmentRecord {
  id: string;
  userId: string;
  assessmentData: AssessmentAnswers;
  completedAt: string | null;
  createdAt: string;
  results?: Array<{
    schemeId: string;
    eligibilityStatus: string;
    missingInformation: string[];
    explanation: string;
  }>;
}

/**
 * Persist an assessment session and its scheme outcomes to Supabase.
 * Enforces deduplication via deterministic fingerprint and transaction rollback on partial failure.
 * In Guest Mode, gracefully returns local ID without network error.
 */
export const saveAssessmentToBackend = async (
  userId: string | null | undefined,
  answers: AssessmentAnswers,
  result: EligibilityAssessmentResult
): Promise<{ success: boolean; assessmentId?: string; error?: string; isGuest?: boolean; isDuplicate?: boolean }> => {
  if (!isSupabaseConfigured() || !userId) {
    // Guest Mode: Stored locally in Zustand/localStorage
    return {
      success: true,
      assessmentId: `local-asm-${Date.now()}`,
      isGuest: true
    };
  }

  try {
    // 1. Compute deterministic idempotency fingerprint to prevent duplicate assessment records
    const sortedAnswersKey = Object.keys(answers || {})
      .sort()
      .map(k => `${k}:${(answers as any)[k]}`)
      .join('|');
    const idempotencyKey = `asm-${userId}-${sortedAnswersKey}`;

    // Check if an assessment with this exact fingerprint already exists for this citizen
    const { data: existingAssessment } = await supabase
      .from('assessments')
      .select('id')
      .eq('user_id', userId)
      .eq('idempotency_key', idempotencyKey)
      .maybeSingle();

    if (existingAssessment) {
      return {
        success: true,
        assessmentId: existingAssessment.id,
        isDuplicate: true
      };
    }

    // 2. Insert assessment parent record with idempotency key
    const { data: assessment, error: assessmentError } = await supabase
      .from('assessments')
      .insert({
        user_id: userId,
        assessment_data: answers as any,
        idempotency_key: idempotencyKey,
        completed_at: new Date().toISOString()
      })
      .select('id')
      .single();

    if (assessmentError || !assessment) {
      return { success: false, error: assessmentError?.message || "Failed to create assessment record." };
    }

    const assessmentId = assessment.id;

    // 3. Prepare individual scheme outcome records
    const schemeResultsToInsert: any[] = [];

    const { data: dbSchemes, error: fetchSchemesError } = await supabase
      .from('schemes')
      .select('id, scheme_code');

    if (fetchSchemesError) {
      // Rollback parent assessment to prevent orphaned records
      await supabase.from('assessments').delete().eq('id', assessmentId);
      return { success: false, error: `Failed to resolve schemes: ${fetchSchemesError.message}. Assessment rolled back.` };
    }

    const schemeIdMap = new Map<string, string>();
    if (dbSchemes) {
      dbSchemes.forEach(s => schemeIdMap.set(s.scheme_code, s.id));
    }

    if (result && result.evaluations) {
      for (const [schemeCode, outcomeRaw] of Object.entries(result.evaluations)) {
        const outcome = outcomeRaw as SchemeEvaluationOutcome;
        const dbSchemeId = schemeIdMap.get(schemeCode);
        if (dbSchemeId && outcome) {
          schemeResultsToInsert.push({
            assessment_id: assessmentId,
            scheme_id: dbSchemeId,
            eligibility_status: outcome.status,
            missing_information: outcome.missingCriteria,
            explanation: { text: outcome.explanation }
          });
        }
      }
    }

    // 4. Insert scheme results and detect failures
    if (schemeResultsToInsert.length > 0) {
      const { error: resultsError } = await supabase
        .from('assessment_results')
        .insert(schemeResultsToInsert);

      if (resultsError) {
        // Rollback parent assessment on partial failure to avoid inconsistent state
        await supabase.from('assessments').delete().eq('id', assessmentId);
        return {
          success: false,
          error: `Failed to persist scheme evaluation details: ${resultsError.message}. Assessment record rolled back.`
        };
      }
    }

    return {
      success: true,
      assessmentId
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to save assessment to backend."
    };
  }
};

export const saveAssessmentToDb = saveAssessmentToBackend;

/**
 * Fetch past assessments for authenticated citizen.
 */
export const fetchUserAssessments = async (
  userId: string
): Promise<{ assessments: SavedAssessmentRecord[]; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return { assessments: [] };
  }

  try {
    const { data, error } = await supabase
      .from('assessments')
      .select(`
        id,
        user_id,
        assessment_data,
        completed_at,
        created_at,
        assessment_results (
          scheme_id,
          eligibility_status,
          missing_information,
          explanation
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error || !data) {
      return { assessments: [], error: error?.message };
    }

    const formatted: SavedAssessmentRecord[] = data.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      assessmentData: row.assessment_data as AssessmentAnswers,
      completedAt: row.completed_at,
      createdAt: row.created_at,
      results: (row.assessment_results || []).map((r: any) => ({
        schemeId: r.scheme_id,
        eligibilityStatus: r.eligibility_status,
        missingInformation: r.missing_information || [],
        explanation: r.explanation?.text || ''
      }))
    }));

    return { assessments: formatted };
  } catch (err: any) {
    return { assessments: [], error: err.message };
  }
};

export const fetchLatestUserAssessment = async (
  userId: string | null | undefined
): Promise<{ assessment: SavedAssessmentRecord | null; error?: string }> => {
  if (!isSupabaseConfigured() || !userId) {
    return { assessment: null };
  }
  const { assessments, error } = await fetchUserAssessments(userId);
  return { assessment: assessments[0] || null, error };
};
