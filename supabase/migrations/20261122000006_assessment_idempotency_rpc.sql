-- =============================================================================
-- Migration 006: Assessment Idempotency RPC Function
-- Phase: 5.2.1 — Final Backend Corrections
-- Description: Adds race-safe atomic assessment persistence function using
--              INSERT ... ON CONFLICT ... RETURNING to eliminate race conditions
--              and return existing assessment ID upon duplicate detection.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.save_assessment_idempotent(
    p_user_id UUID,
    p_assessment_data JSONB,
    p_idempotency_key TEXT,
    p_completed_at TIMESTAMPTZ DEFAULT now()
)
RETURNS TABLE (
    id UUID,
    is_duplicate BOOLEAN
) AS $$
DECLARE
    v_id UUID;
    v_is_duplicate BOOLEAN;
BEGIN
    -- Race-safe atomic insert with unique constraint conflict resolution
    -- DO UPDATE on conflict triggers RETURNING with xmax <> 0 to signify existing record
    INSERT INTO public.assessments (user_id, assessment_data, idempotency_key, completed_at)
    VALUES (p_user_id, p_assessment_data, p_idempotency_key, p_completed_at)
    ON CONFLICT (user_id, idempotency_key) WHERE idempotency_key IS NOT NULL
    DO UPDATE SET idempotency_key = EXCLUDED.idempotency_key
    RETURNING assessments.id, (xmax <> 0) INTO v_id, v_is_duplicate;

    RETURN QUERY SELECT v_id, v_is_duplicate;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution to authenticated citizens and service_role
GRANT EXECUTE ON FUNCTION public.save_assessment_idempotent(UUID, JSONB, TEXT, TIMESTAMPTZ) TO authenticated, service_role;
