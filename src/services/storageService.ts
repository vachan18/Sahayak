import { supabase, isSupabaseConfigured, storageBucketName } from '../lib/supabaseClient';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const ALLOWED_MIME_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Validates file type and size before any upload operation.
 */
export const validateUploadFile = (file: File): FileValidationResult => {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file format. Only PDF, JPEG, and PNG documents are allowed."
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds the 5MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`
    };
  }

  return { valid: true };
};

export const validateDocumentFile = validateUploadFile;

/**
 * Uploads a document to the private user-documents storage bucket under the user's isolated folder.
 * Path pattern: {userId}/{docType}-{timestamp}.{ext}
 */
export const uploadUserDocument = async (
  userId: string | null | undefined,
  docType: string,
  file: File
): Promise<{ success: boolean; filePath?: string; error?: string; isGuest?: boolean }> => {
  const validation = validateUploadFile(file);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  if (!userId) {
    return {
      success: false,
      error: "User must be authenticated to upload documents to cloud storage."
    };
  }

  if (!isSupabaseConfigured()) {
    // Unconfigured cloud mode: simulated secure local path
    return {
      success: true,
      filePath: `${userId}/${docType}-${Date.now()}`,
      isGuest: true
    };
  }

  try {
    const fileExtension = file.name.split('.').pop() || 'pdf';
    const sanitizedDocType = docType.replace(/[^a-zA-Z0-9_-]/g, '_');
    const filePath = `${userId}/${sanitizedDocType}-${Date.now()}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from(storageBucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error || !data) {
      return { success: false, error: error?.message || "Failed to upload document." };
    }

    return {
      success: true,
      filePath: data.path
    };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error during upload." };
  }
};

/**
 * Creates a short-lived secure signed URL to download or view a private document.
 * Never uses or returns public URLs for user documents.
 */
export const getSecureSignedUrl = async (
  filePath: string,
  expiresInSeconds: number = 300 // 5 minutes default
): Promise<{ signedUrl?: string; error?: string }> => {
  if (!isSupabaseConfigured() || filePath.startsWith('local/')) {
    // In local demo / guest mode, return simulated object URL
    return { signedUrl: filePath };
  }

  try {
    const { data, error } = await supabase.storage
      .from(storageBucketName)
      .createSignedUrl(filePath, expiresInSeconds);

    if (error || !data?.signedUrl) {
      return { error: error?.message || "Failed to generate secure download link." };
    }

    return { signedUrl: data.signedUrl };
  } catch (err: any) {
    return { error: err.message };
  }
};

export const getDocumentSignedUrl = async (
  userId: string | null | undefined,
  filePath: string,
  expiresInSeconds: number = 300
): Promise<{ signedUrl: string | null; error?: string }> => {
  if (!userId) {
    return { signedUrl: null, error: "User must be authenticated to access document." };
  }
  const res = await getSecureSignedUrl(filePath, expiresInSeconds);
  return { signedUrl: res.signedUrl || null, error: res.error };
};
