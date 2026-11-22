-- =============================================================================
-- Migration 003: Storage Bucket Configuration & Policies for SAHAYAK
-- Timestamp: 20261122000003
-- Description: Configures private user-documents storage bucket with RLS policies.
--              Enforces private signed URLs. Prohibits public document exposure.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1. Create Private Storage Bucket
-- -----------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'user-documents',
    'user-documents',
    false, -- Strictly PRIVATE; requires signed URLs
    5242880, -- 5MB file size limit
    ARRAY['application/pdf', 'image/jpeg', 'image/png']
)
ON CONFLICT (id) DO UPDATE SET
    public = false,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['application/pdf', 'image/jpeg', 'image/png'];

-- -----------------------------------------------------------------------------
-- 2. Storage RLS Policies (Folder-Based Isolation: {user_id}/{document_name})
-- -----------------------------------------------------------------------------

-- Authenticated users can upload documents only into their designated {user_id} folder
CREATE POLICY "Users can upload own documents"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Authenticated users can view/download only their own documents
CREATE POLICY "Users can view own documents"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Authenticated users can update/replace only their own documents
CREATE POLICY "Users can update own documents"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );

-- Authenticated users can delete only their own documents
CREATE POLICY "Users can delete own documents"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'user-documents' AND
        (storage.foldername(name))[1] = auth.uid()::text
    );
