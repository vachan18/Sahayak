import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { DeviceMobile, Eye, EyeSlash, CheckCircle, WarningCircle, ArrowLeft, LockKey } from '@phosphor-icons/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { loginUser, registerUser, requestPasswordReset } from '../../services/authService';
import { Sheet } from '../../ui/Sheet';
import { Button } from '../../ui/Button';
import { Segmented } from '../../ui/Chip';
import { TextField } from '../../ui/Field';
import { cx } from '../../ui/cx';
import { haptic } from '../../lib/haptics';
import type { SupportedLanguage } from '../../types';

type View = 'login' | 'register' | 'forgot_password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: View;
}

function Notice({ tone, children }: { tone: 'success' | 'error' | 'info'; children: React.ReactNode }) {
  const Icon = tone === 'success' ? CheckCircle : WarningCircle;
  return (
    <motion.div
      role={tone === 'error' ? 'alert' : 'status'}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden"
    >
      <div className={cx('flex items-start gap-3 rounded-md px-4 py-3 text-small font-medium', tone === 'success' ? 'bg-patti-tint text-patti' : tone === 'error' ? 'bg-sindoor-tint text-sindoor' : 'bg-kesar-tint text-kesar')}>
        <Icon size={20} weight="fill" className="shrink-0 mt-0.5" />
        <span>{children}</span>
      </div>
    </motion.div>
  );
}

/**
 * Sign-in is optional by design. Shared phones and CSC kiosks are the norm, so the
 * guest path is presented first and explained plainly; an account only adds sync.
 */
export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialView = 'login' }) => {
  const { t, language } = useTranslation();
  const { setAuthUser } = useAppStore();
  const [view, setView] = useState<View>(initialView);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) setView(initialView);
  }, [isOpen, initialView]);

  const switchView = (v: View) => {
    setNotice(null);
    setPassword('');
    setView(v);
  };

  const finish = (text: string) => {
    haptic('success');
    setNotice({ tone: 'success', text });
    setTimeout(() => {
      onClose();
      setNotice(null);
      setEmail('');
      setPassword('');
      setFullName('');
    }, 800);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    setLoading(true);
    try {
      if (view === 'login') {
        const res = await loginUser(email, password);
        if (res.success && res.user) {
          setAuthUser(res.user);
          finish(t('entry.auth.signedIn', 'Signed in. Welcome back.'));
        } else if (res.isGuest) {
          setNotice({ tone: 'info', text: t('entry.auth.guestMode') });
        } else {
          haptic('error');
          setNotice({ tone: 'error', text: res.error || t('entry.auth.failed') });
        }
      } else if (view === 'register') {
        const res = await registerUser({
          email,
          password,
          fullName: fullName.trim() || 'Citizen Beneficiary',
          preferredLanguage: language as SupportedLanguage,
        } as Parameters<typeof registerUser>[0]);
        if (res.success && res.user) {
          setAuthUser(res.user);
          finish(t('entry.auth.created', 'Account created. Your progress is now saved.'));
        } else if (res.isGuest) {
          setNotice({ tone: 'info', text: t('entry.auth.guestMode') });
        } else {
          haptic('error');
          setNotice({ tone: 'error', text: res.error || t('entry.auth.failedCreate') });
        }
      } else {
        const res = await requestPasswordReset(email);
        if (res.success) setNotice({ tone: 'success', text: t('entry.auth.linkSent', 'Reset link sent. Check your email.') });
        else setNotice({ tone: 'error', text: res.error || t('entry.voice.err.unknown') });
      }
    } catch (err) {
      setNotice({ tone: 'error', text: (err as Error)?.message || t('entry.voice.err.unknown') });
    } finally {
      setLoading(false);
    }
  };

  const forgot = view === 'forgot_password';

  return (
    <Sheet open={isOpen} onClose={onClose} title={forgot ? t('entry.auth.forgotTitle', 'Reset your password') : t('entry.auth.title', 'Keep your progress safe')} description={forgot ? t('entry.auth.forgotBody') : undefined} size="sm" closeLabel={t('navClose', 'Close')}>
      {!forgot && (
        <div className="rounded-lg bg-neel-tint text-neel-ink p-4 flex gap-3">
          <DeviceMobile size={26} weight="duotone" className="shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold">{t('entry.auth.guestTitle', 'You do not need an account')}</p>
            <p className="text-small mt-1 text-ink-2">{t('entry.auth.guestBody')}</p>
            <button type="button" onClick={onClose} className="mt-2 h-10 -ms-1 px-1 text-small font-semibold underline underline-offset-4">
              {t('entry.auth.continueGuest', 'Continue without an account')}
            </button>
          </div>
        </div>
      )}

      {forgot ? (
        <button type="button" onClick={() => switchView('login')} className="inline-flex items-center gap-1.5 h-10 text-small font-semibold text-neel-ink">
          <ArrowLeft size={16} weight="bold" className="flip-rtl" /> {t('entry.auth.backToSignIn', 'Back to sign in')}
        </button>
      ) : (
        <Segmented
          className="w-full mt-5"
          layoutKey="auth"
          label={t('entry.auth.title', 'Keep your progress safe')}
          value={view}
          onChange={(v) => switchView(v)}
          options={[
            { value: 'login' as View, label: t('entry.auth.signIn', 'Sign in') },
            { value: 'register' as View, label: t('entry.auth.register', 'Create account') },
          ]}
        />
      )}

      <form onSubmit={submit} className="mt-5 space-y-4" noValidate>
        <AnimatePresence initial={false}>
          {view === 'register' && (
            <motion.div key="name" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <TextField label={t('entry.auth.name', 'Your name')} placeholder={t('entry.auth.namePlaceholder')} value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
            </motion.div>
          )}
        </AnimatePresence>
        <TextField label={t('entry.auth.email', 'Email address')} type="email" inputMode="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        {!forgot && (
          <div className="relative">
            <TextField
              label={t('entry.auth.password', 'Password')}
              hint={view === 'register' ? t('entry.auth.passwordHint') : undefined}
              type={showPw ? 'text' : 'password'}
              autoComplete={view === 'register' ? 'new-password' : 'current-password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pe-14"
            />
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? t('entry.auth.hide', 'Hide password') : t('entry.auth.show', 'Show password')}
              className="absolute end-1 top-[30px] w-12 h-12 grid place-items-center rounded-md text-ink-3 hover:text-ink"
            >
              {showPw ? <EyeSlash size={20} /> : <Eye size={20} />}
            </button>
          </div>
        )}

        <AnimatePresence>{notice && <Notice tone={notice.tone}>{notice.text}</Notice>}</AnimatePresence>

        <Button type="submit" size="lg" block loading={loading} variant={view === 'login' ? 'solid' : 'primary'}>
          {view === 'login' ? t('entry.auth.signIn', 'Sign in') : view === 'register' ? t('entry.auth.register', 'Create account') : t('entry.auth.sendLink', 'Send reset link')}
        </Button>

        {view === 'login' && (
          <button type="button" onClick={() => switchView('forgot_password')} className="w-full h-11 text-small font-semibold text-neel-ink hover:underline underline-offset-4">
            {t('entry.auth.forgot', 'Forgot password?')}
          </button>
        )}
      </form>

      <p className="mt-5 flex items-center justify-center gap-2 text-micro text-ink-3">
        <LockKey size={16} weight="duotone" />
        {t('entry.auth.privacy', 'We never ask for your Aadhaar number or bank PIN.')}
      </p>
    </Sheet>
  );
};

export default AuthModal;
