import React, { useState } from 'react';
import { X, Lock, Mail, User, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { loginUser, registerUser, requestPasswordReset } from '../../services/authService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'register' | 'forgot_password';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = 'login'
}) => {
  const { t, language } = useTranslation();
  const { setAuthUser } = useAppStore();

  const [view, setView] = useState<'login' | 'register' | 'forgot_password'>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetFormState = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setEmail('');
    setPassword('');
    setFullName('');
  };

  const handleTabSwitch = (newView: 'login' | 'register' | 'forgot_password') => {
    resetFormState();
    setView(newView);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      if (view === 'login') {
        const res = await loginUser(email, password);
        if (res.success && res.user) {
          setAuthUser(res.user);
          setSuccessMessage("Signed in successfully!");
          setTimeout(() => {
            onClose();
            resetFormState();
          }, 600);
        } else if (res.isGuest) {
          setErrorMessage(res.error || "Operating in Guest Mode. Connect Supabase to sync.");
        } else {
          setErrorMessage(res.error || "Failed to sign in. Please verify your credentials.");
        }
      } else if (view === 'register') {
        const res = await registerUser({
          email,
          password,
          fullName: fullName.trim() || 'Citizen Beneficiary',
          preferredLanguage: (language as any) || 'kn'
        });

        if (res.success && res.user) {
          setAuthUser(res.user);
          setSuccessMessage("Account created successfully!");
          setTimeout(() => {
            onClose();
            resetFormState();
          }, 800);
        } else if (res.isGuest) {
          setErrorMessage(res.error || "Operating in Guest Mode. Connect Supabase to sync.");
        } else {
          setErrorMessage(res.error || "Failed to create account.");
        }
      } else if (view === 'forgot_password') {
        const res = await requestPasswordReset(email);
        if (res.success) {
          setSuccessMessage("Password reset email sent! Check your inbox.");
        } else {
          setErrorMessage(res.error || "Failed to send reset link.");
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-crisp-xl relative overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={() => {
            resetFormState();
            onClose();
          }}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 rounded-xl bg-brand-navy-900 dark:bg-sky-500 text-white font-extrabold flex items-center justify-center text-sm shadow-sm">
            {language === 'kn' ? 'ಸ' : 'S'}
          </div>
          <div>
            <div className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
              {t('appName', 'SAHAYAK')} Account
            </div>
            <div className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">
              {language === 'kn' ? 'ನಾಗರಿಕ ಲಾಗಿನ್ ಮತ್ತು ಖಾತೆ' : 'Citizen Access & Cloud Sync'}
            </div>
          </div>
        </div>

        {/* Tabs: Sign In vs Register */}
        <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1 mb-5">
          <button
            type="button"
            onClick={() => handleTabSwitch('login')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              view === 'login'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'kn' ? 'ಲಾಗಿನ್' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => handleTabSwitch('register')}
            className={`flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all ${
              view === 'register'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            {language === 'kn' ? 'ನೋಂದಣಿ' : 'Create Account'}
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 flex items-start gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{successMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {view === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'kn' ? 'ಪೂರ್ಣ ಹೆಸರು' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Rameshwar Yadav"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'kn' ? 'ಇಮೇಲ್ ವಿಳಾಸ' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {view !== 'forgot_password' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'kn' ? 'ಪಾಸ್‌ವರ್ಡ್' : 'Password'}
                </label>
                {view === 'login' && (
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('forgot_password')}
                    className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            {isLoading ? (
              <span>Processing...</span>
            ) : view === 'login' ? (
              <>
                <span>{language === 'kn' ? 'ಲಾಗಿನ್ ಮಾಡಿ' : 'Sign In to Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : view === 'register' ? (
              <>
                <span>{language === 'kn' ? 'ಖಾತೆ ತೆರೆಯಿರಿ' : 'Create Sovereign Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            ) : (
              <span>Send Password Reset Email</span>
            )}
          </button>
        </form>

        {/* Guest Mode Indicator & Disclaimer */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Zero Forced Authentication • Sovereign Guest Mode Supported</span>
          </div>
          <button
            type="button"
            onClick={() => {
              resetFormState();
              onClose();
            }}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:underline"
          >
            {language === 'kn' ? 'ಅತಿಥಿಯಾಗಿ ಮುಂದುವರಿಯಿರಿ' : 'Continue as Guest without signing in'}
          </button>
        </div>
      </div>
    </div>
  );
};
