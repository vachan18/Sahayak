import { User, Session } from '@supabase/supabase-js';
import { z } from 'zod';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface AuthStateChangeCallback {
  (user: User | null, session: Session | null): void;
}

// Zod schemas for input validation
export const EmailSchema = z.string().email("Please provide a valid email address");
export const PasswordSchema = z.string().min(6, "Password must be at least 6 characters");
export const SignUpSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  preferredLanguage: z.enum(['kn', 'hi', 'en']).default('kn')
});

export type SignUpInput = z.infer<typeof SignUpSchema>;

export interface AuthResponse {
  success: boolean;
  user?: User | null;
  error?: string;
  isGuest?: boolean;
}

/**
 * Register a new user with email, password, and metadata.
 * Profile is automatically generated in `public.profiles` via database trigger.
 */
export const registerUser = async (input: SignUpInput): Promise<AuthResponse> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase cloud backend is not configured with project credentials. Running in Guest Mode.",
      isGuest: true
    };
  }

  const validation = SignUpSchema.safeParse(input);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.errors[0]?.message || "Invalid registration inputs."
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          full_name: input.fullName,
          preferred_language: input.preferredLanguage
        }
      }
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: data.user
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to complete registration."
    };
  }
};

/**
 * Sign in with email and password.
 */
export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Supabase cloud backend is not configured. Running in Guest Mode.",
      isGuest: true
    };
  }

  if (!email || !password) {
    return { success: false, error: "Please enter both email and password." };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return {
      success: true,
      user: data.user
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to log in."
    };
  }
};

/**
 * Sign out current authenticated user.
 */
export const logoutUser = async (): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return { success: true };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to sign out." };
  }
};

/**
 * Send password reset email.
 */
export const requestPasswordReset = async (email: string): Promise<{ success: boolean; error?: string }> => {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: "Password reset requires an active Supabase project configuration."
    };
  }

  const emailValidation = EmailSchema.safeParse(email);
  if (!emailValidation.success) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to send reset email." };
  }
};

/**
 * Get current active session.
 */
export const getActiveSession = async (): Promise<Session | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch {
    return null;
  }
};

/**
 * Get currently authenticated user.
 */
export const getCurrentUser = async (): Promise<User | null> => {
  if (!isSupabaseConfigured()) return null;
  try {
    const { data } = await supabase.auth.getUser();
    return data.user;
  } catch {
    return null;
  }
};

/**
 * Listen to auth state transitions.
 */
export const subscribeToAuthChanges = (callback: AuthStateChangeCallback) => {
  if (!isSupabaseConfigured()) {
    return { unsubscribe: () => {} };
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session?.user || null, session);
  });

  return {
    unsubscribe: () => subscription.unsubscribe()
  };
};

export const onAuthStateChange = subscribeToAuthChanges;
export const resetPassword = requestPasswordReset;
