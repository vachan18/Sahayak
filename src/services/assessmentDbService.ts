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
 * Deterministic canonical JSON serialization.
 * - Recursively sorts object keys lexicographically.
 * - Preserves original value types (numbers, booleans, strings, null).
 * - Preserves string case exactly without mutations.
 * - Omits undefined properties from objects.
 * - Serializes arrays in their exact item order.
 */
export function canonicalJsonStringify(data: any): string {
  if (data === null || typeof data !== 'object') {
    return JSON.stringify(data);
  }

  if (Array.isArray(data)) {
    return '[' + data.map(item => (item === undefined ? 'null' : canonicalJsonStringify(item))).join(',') + ']';
  }

  const sortedKeys = Object.keys(data).sort();
  const entries: string[] = [];
  for (const key of sortedKeys) {
    const val = data[key];
    if (val !== undefined) {
      entries.push(`${JSON.stringify(key)}:${canonicalJsonStringify(val)}`);
    }
  }
  return '{' + entries.join(',') + '}';
}

/**
 * Computes a deterministic SHA-256 digest from canonical JSON serialization of assessment answers.
 * Preserves original value types and case.
 * Strictly uses SHA-256 via native Web Crypto API.
 * Throws a clear error if secure cryptographic hashing is unavailable (no weak fallback).
 */
export async function computeCanonicalAnswersSha256(
  userId: string,
  answers: AssessmentAnswers
): Promise<string> {
  // Deterministic canonical JSON serialization preserving exact types and casing
  const canonicalPayload = canonicalJsonStringify({ answers: answers || {}, userId });

  const cryptoObj = typeof crypto !== 'undefined' ? crypto : (globalThis as any)?.crypto;
  const subtle = cryptoObj?.subtle;

  if (!subtle || typeof subtle.digest !== 'function') {
    throw new Error('Secure hashing unavailable: Web Crypto API (crypto.subtle) with SHA-256 is required.');
  }

  const msgBuffer = new TextEncoder().encode(canonicalPayload);
  const hashBuffer = await subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return `sha256-${hashArray.map(b => b.toString(16).padStart(2, '0')).join('')}`;
}

/**
 * Persist an assessment session and its scheme outcomes to Supabase.
 * Enforces race-safe idempotency via PostgreSQL unique constraint and RPC (INSERT ... ON CONFLICT ... RETURNING).
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
    // 1. Compute SHA-256 hash using deterministic canonical JSON
    const idempotencyKey = await computeCanonicalAnswersSha256(userId, answers);

    // 2. Race-safe atomic insert using database RPC with INSERT ... ON CONFLICT ... RETURNING
    const { data: rpcData, error: rpcError } = await supabase.rpc('save_assessment_idempotent', {
      p_user_id: userId,
      p_assessment_data: answers as any,
      p_idempotency_key: idempotencyKey,
      p_completed_at: new Date().toISOString()
    });

    if (rpcError) {
      return { success: false, error: rpcError.message || "Failed to persist assessment via database function." };
    }

    const row = Array.isArray(rpcData) ? rpcData[0] : rpcData;
    if (!row || !row.id) {
      return { success: false, error: "Database function did not return an assessment record." };
    }

    const assessmentId = row.id;
    const isDuplicate = Boolean(row.is_duplicate);

    // If duplicate was detected by unique constraint, return existing assessment ID immediately
    if (isDuplicate) {
      return {
        success: true,
        assessmentId,
        isDuplicate: true
      };
    }

    // 3. Prepare individual scheme outcome records for new assessment
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
      assessmentId,
      isDuplicate: false
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
