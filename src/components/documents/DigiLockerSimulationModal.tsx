import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ShieldCheck, LockKey, CheckCircle, CircleNotch, Check, Info, CloudArrowDown } from '@phosphor-icons/react';
import type { DocumentSpec } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';
import { Sheet } from '../../ui/Sheet';
import { Button } from '../../ui/Button';
import { cx } from '../../ui/cx';
import { haptic } from '../../lib/haptics';
import { ease, spring, dur } from '../../ui/motion';
import { paperInfo } from './paperInfo';
import { toneTint } from '../../ui/Surface';

interface DigiLockerSimulationModalProps {
  isOpen: boolean;
  onClose: () => void;
  documents: DocumentSpec[];
  onCompleteVerification: (verifiedDocIds: string[]) => void;
}

type Step = 'consent' | 'otp' | 'select' | 'fetching' | 'done';
const STEPS: Step[] = ['consent', 'otp', 'select', 'fetching', 'done'];

/**
 * DigiLocker, explained step by step.
 * Fetching a paper from DigiLocker means it is already verified by the issuing department —
 * no photo, no queue. This is a practice flow; nothing is sent anywhere.
 */
export const DigiLockerSimulationModal = ({ isOpen, onClose, documents, onCompleteVerification }: DigiLockerSimulationModalProps) => {
  const { t } = useTranslation();
  const eligible = documents.filter((d) => d.digiLockerSupported);
  const [step, setStep] = useState<Step>('consent');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [selected, setSelected] = useState<string[]>([]);
  const [fetched, setFetched] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep('consent');
      setOtp(['', '', '', '', '', '']);
      setSelected(eligible.map((d) => d.id));
      setFetched([]);
      setBusy(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const otpComplete = otp.every((d) => d.length === 1);

  const verifyOtp = () => {
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      haptic('success');
      setStep('select');
    }, 900);
  };

  const fetchDocs = () => {
    setStep('fetching');
    selected.forEach((id, i) => {
      setTimeout(() => {
        setFetched((f) => [...f, id]);
        haptic('tap');
        if (i === selected.length - 1) {
          setTimeout(() => {
            haptic('success');
            setStep('done');
            onCompleteVerification(selected);
          }, 450);
        }
      }, 700 * (i + 1));
    });
  };

  const stepIndex = STEPS.indexOf(step);

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      size="md"
      title={t('documents.dl.title', 'Fetch papers from DigiLocker')}
      description={t('documents.dl.subtitle', 'Papers from DigiLocker are already verified by the government. No photo needed.')}
      closeLabel={t('navClose', 'Close')}
    >
      {/* step dots */}
      <div className="flex items-center gap-1.5 mb-5" aria-hidden>
        {STEPS.slice(0, 4).map((s, i) => (
          <motion.span key={s} className={cx('h-1.5 rounded-full', i <= stepIndex ? 'bg-neel' : 'bg-sunken')} animate={{ width: i === Math.min(stepIndex, 3) ? 28 : 12 }} transition={spring.snappy} />
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0, transition: { duration: dur.medium, ease: ease.out } }}
          exit={{ opacity: 0, x: -12, transition: { duration: dur.short, ease: ease.in } }}
        >
          {step === 'consent' && (
            <div className="space-y-4">
              <div className="flex gap-3 p-4 rounded-md bg-neel-tint">
                <ShieldCheck size={26} weight="duotone" className="text-neel-ink shrink-0" />
                <div>
                  <p className="font-semibold">{t('documents.dl.consentTitle', 'You stay in control')}</p>
                  <p className="text-small text-ink-2 mt-1">{t('documents.dl.consentBody', 'Sahayak only reads the papers you pick. You can remove access any time from your DigiLocker app.')}</p>
                </div>
              </div>
              <p className="flex gap-2 text-small text-ink-2">
                <Info size={18} className="shrink-0 mt-0.5" />
                {t('documents.dl.demo', 'Practice demo — no real DigiLocker account is connected and nothing leaves this phone.')}
              </p>
              <Button size="lg" variant="solid" block onClick={() => setStep('otp')}>
                {t('documents.dl.agree', 'I agree, continue')}
              </Button>
            </div>
          )}

          {step === 'otp' && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-md bg-sunken grid place-items-center">
                  <LockKey size={24} weight="duotone" />
                </span>
                <div>
                  <p className="font-semibold">{t('documents.dl.otpTitle', 'Enter the 6-digit code')}</p>
                  <p className="text-small text-ink-2">{t('documents.dl.otpBody', 'Sent to the mobile number linked with your Aadhaar. For this demo, type any 6 digits.')}</p>
                </div>
              </div>
              <div className="flex justify-between gap-2 max-w-sm" dir="ltr">
                {otp.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => (otpRefs.current[i] = el)}
                    autoFocus={i === 0}
                    value={d}
                    inputMode="numeric"
                    autoComplete={i === 0 ? 'one-time-code' : 'off'}
                    maxLength={1}
                    aria-label={`${t('documents.dl.digit', 'Digit')} ${i + 1}`}
                    onChange={(e) => {
                      const v = e.target.value.replace(/\D/g, '').slice(-1);
                      setOtp((o) => o.map((x, j) => (j === i ? v : x)));
                      if (v && i < 5) otpRefs.current[i + 1]?.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
                    }}
                    onPaste={(e) => {
                      const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
                      if (digits.length) {
                        e.preventDefault();
                        setOtp((o) => o.map((x, j) => digits[j] ?? x));
                        otpRefs.current[Math.min(digits.length, 5)]?.focus();
                      }
                    }}
                    className="num w-full min-w-0 aspect-square max-w-[52px] text-center text-h3 font-semibold rounded-md bg-surface shadow-hair focus:outline-none focus:shadow-[0_0_0_2px_rgb(var(--c-neel))]"
                  />
                ))}
              </div>
              <Button size="lg" variant="solid" block disabled={!otpComplete} loading={busy} onClick={verifyOtp}>
                {t('documents.dl.verify', 'Verify')}
              </Button>
            </div>
          )}

          {step === 'select' && (
            <div className="space-y-4">
              <p className="font-semibold">{t('documents.dl.pick', 'Which papers should we fetch?')}</p>
              {eligible.length === 0 ? (
                <p className="text-ink-2">{t('documents.dl.none', 'None of the papers for this scheme are available in DigiLocker. Scan them instead.')}</p>
              ) : (
                <ul className="space-y-2">
                  {eligible.map((d) => {
                    const info = paperInfo(d.id);
                    const Icon = info.icon;
                    const on = selected.includes(d.id);
                    return (
                      <li key={d.id}>
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={on}
                          onClick={() => {
                            haptic('select');
                            setSelected((s) => (on ? s.filter((x) => x !== d.id) : [...s, d.id]));
                          }}
                          className={cx('w-full flex items-center gap-3 p-3 rounded-md text-start transition-shadow', on ? 'bg-surface shadow-[0_0_0_2px_rgb(var(--c-neel))]' : 'bg-surface shadow-hair')}
                        >
                          <span className={cx('w-10 h-10 rounded-sm grid place-items-center shrink-0', toneTint[info.tone])}>
                            <Icon size={22} weight="duotone" />
                          </span>
                          <span className="flex-1 min-w-0 font-medium">{t(d.nameKey, d.nameKey)}</span>
                          <span className={cx('w-6 h-6 rounded-xs grid place-items-center shrink-0 transition-colors', on ? 'bg-neel text-on-neel' : 'shadow-[inset_0_0_0_2px_rgb(var(--c-line-strong))]')}>
                            {on && <Check size={16} weight="bold" />}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              <Button size="lg" variant="solid" block disabled={selected.length === 0} onClick={fetchDocs} iconStart={<CloudArrowDown size={22} />}>
                {t('documents.dl.fetch', 'Fetch selected papers')}
              </Button>
            </div>
          )}

          {(step === 'fetching' || step === 'done') && (
            <div className="space-y-4">
              <ul className="space-y-2" aria-live="polite">
                {selected.map((id) => {
                  const d = eligible.find((x) => x.id === id);
                  const got = fetched.includes(id);
                  return (
                    <li key={id} className="flex items-center gap-3 p-3 rounded-md bg-surface shadow-hair">
                      <span className="w-7 h-7 grid place-items-center">
                        {got ? (
                          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={spring.bouncy}>
                            <CheckCircle size={26} weight="fill" className="text-patti" />
                          </motion.span>
                        ) : (
                          <CircleNotch size={22} className="animate-spin text-neel" />
                        )}
                      </span>
                      <span className="flex-1 min-w-0 font-medium truncate">{d ? t(d.nameKey, d.nameKey) : id}</span>
                      {got && <span className="text-micro font-semibold text-patti">{t('documents.dl.verified', 'Verified')}</span>}
                    </li>
                  );
                })}
              </ul>
              {step === 'done' && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <p className="p-4 rounded-md bg-patti-tint font-semibold text-patti">{t('documents.dl.doneTitle', 'Done. These papers are ready.')}</p>
                  <Button size="lg" variant="solid" block onClick={onClose}>
                    {t('documents.dl.finish', 'Back to my papers')}
                  </Button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Sheet>
  );
};

export default DigiLockerSimulationModal;
