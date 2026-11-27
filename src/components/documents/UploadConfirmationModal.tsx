import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, CheckCircle, XCircle, CircleNotch, ImageSquare, ArrowClockwise, Lightbulb, VideoCamera } from '@phosphor-icons/react';
import { useTranslation } from '../../hooks/useTranslation';
import { Sheet } from '../../ui/Sheet';
import { Button } from '../../ui/Button';
import { cx } from '../../ui/cx';
import { haptic } from '../../lib/haptics';
import { spring, ease } from '../../ui/motion';
import { MockDocument } from './MockDocument';
import type { SampleKind } from './paperInfo';

interface UploadConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentName: string;
  sampleKind?: SampleKind;
  /** Demo of error recovery: the first capture fails the glare check */
  failFirstAttempt?: boolean;
  onConfirmUpload: (docId: string) => void;
  /** Called when a capture fails a quality check (marks the paper "needs attention") */
  onQualityFail?: (docId: string) => void;
}

type Phase = 'frame' | 'checking' | 'failed' | 'passed';
type CheckState = 'wait' | 'run' | 'pass' | 'fail';

const CHECKS = [
  { key: 'documents.scan.checkSharp', fallback: 'Text is sharp' },
  { key: 'documents.scan.checkGlare', fallback: 'No shine or glare' },
  { key: 'documents.scan.checkCorners', fallback: 'All 4 corners visible' },
];

/**
 * Scan a paper.
 * The phone checks the photo *before* it is submitted — so a blurry passbook is caught
 * at home, not at the counter after a bus ride. Uses the real camera when allowed,
 * falls back to an illustrated viewfinder.
 */
export const UploadConfirmationModal = ({
  isOpen,
  onClose,
  documentId,
  documentName,
  sampleKind = 'certificate',
  failFirstAttempt = false,
  onConfirmUpload,
  onQualityFail,
}: UploadConfirmationModalProps) => {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<Phase>('frame');
  const [checks, setChecks] = useState<CheckState[]>(['wait', 'wait', 'wait']);
  const [attempt, setAttempt] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timers = useRef<number[]>([]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  useEffect(() => {
    if (isOpen) {
      setPhase('frame');
      setChecks(['wait', 'wait', 'wait']);
      setAttempt(0);
      setFileName(null);
      setCameraError(false);
    } else {
      stopCamera();
    }
    return () => {
      timers.current.forEach((id) => window.clearTimeout(id));
      timers.current = [];
    };
  }, [isOpen]);

  useEffect(() => () => stopCamera(), []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      setCameraOn(true);
      requestAnimationFrame(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => undefined);
        }
      });
    } catch {
      setCameraError(true);
    }
  };

  const runChecks = () => {
    haptic('select');
    stopCamera();
    setPhase('checking');
    setChecks(['run', 'wait', 'wait']);
    const willFail = failFirstAttempt && attempt === 0;
    const failAt = willFail ? 1 : -1;
    const step = 650;
    CHECKS.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setChecks((prev) => {
            const next = [...prev];
            next[i] = i === failAt ? 'fail' : 'pass';
            if (i + 1 < CHECKS.length && i !== failAt) next[i + 1] = 'run';
            return next;
          });
          if (i === failAt) {
            haptic('warning');
            setPhase('failed');
            onQualityFail?.(documentId);
            timers.current.forEach((id) => window.clearTimeout(id));
          } else if (i === CHECKS.length - 1) {
            haptic('success');
            setPhase('passed');
          }
        }, step * (i + 1))
      );
    });
    setAttempt((a) => a + 1);
  };

  const retake = () => {
    setPhase('frame');
    setChecks(['wait', 'wait', 'wait']);
    setFileName(null);
  };

  const confirm = () => {
    onConfirmUpload(documentId);
    onClose();
  };

  const flaw = phase === 'failed' ? 'glare' : 'none';

  return (
    <Sheet
      open={isOpen}
      onClose={onClose}
      size="md"
      title={t('documents.scan.title', 'Scan your paper')}
      description={documentName}
      closeLabel={t('navClose', 'Close')}
    >
      {/* Viewfinder */}
      <div className="relative rounded-lg overflow-hidden bg-[#14120E] aspect-[4/3]">
        {cameraOn ? (
          <video ref={videoRef} playsInline muted className="absolute inset-0 w-full h-full object-cover" aria-label={t('documents.scan.liveCamera', 'Live camera')} />
        ) : (
          <motion.div
            key={flaw}
            initial={{ scale: 1.04, opacity: 0.6 }}
            animate={{ scale: phase === 'frame' ? 0.92 : 0.88, opacity: 1 }}
            transition={{ duration: 0.5, ease: ease.out }}
            className="absolute inset-0 grid place-items-center"
          >
            <MockDocument kind={sampleKind} flaw={flaw} className="w-full h-full" />
          </motion.div>
        )}

        {/* corner guides */}
        {[
          'top-4 start-4 border-t-[3px] border-s-[3px] rounded-ss-md',
          'top-4 end-4 border-t-[3px] border-e-[3px] rounded-se-md',
          'bottom-4 start-4 border-b-[3px] border-s-[3px] rounded-es-md',
          'bottom-4 end-4 border-b-[3px] border-e-[3px] rounded-ee-md',
        ].map((pos, i) => (
          <motion.span
            key={pos}
            aria-hidden
            initial={{ opacity: 0, scale: 1.3 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.05, ...spring.snappy }}
            className={cx(
              'absolute w-9 h-9',
              pos,
              phase === 'passed' ? 'border-[rgb(112_200_150)]' : phase === 'failed' ? 'border-[rgb(242_142_118)]' : 'border-haldi'
            )}
          />
        ))}

        {/* scanning beam */}
        {phase === 'checking' && (
          <motion.span
            aria-hidden
            className="absolute inset-x-6 h-0.5 bg-haldi shadow-[0_0_18px_4px_rgb(var(--c-haldi)/0.6)]"
            initial={{ top: '12%' }}
            animate={{ top: ['12%', '88%', '12%'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        <p className="absolute bottom-3 inset-x-0 flex justify-center px-4 pointer-events-none" aria-live="polite">
          <span className="max-w-full rounded-full bg-black/60 backdrop-blur px-3.5 py-1 text-small font-medium text-white">
          {phase === 'frame' && t('documents.scan.hint', 'Fit the whole page inside the corners')}
          {phase === 'checking' && t('documents.scan.checking', 'Checking your photo…')}
          {phase === 'passed' && t('documents.scan.passedShort', 'Clear and readable')}
          {phase === 'failed' && t('documents.scan.failedShort', 'Too much shine on the numbers')}
          </span>
        </p>
        {fileName && phase !== 'frame' && (
          <span className="absolute top-3 inset-x-14 text-center text-micro text-white/80 truncate">{fileName}</span>
        )}
      </div>

      {/* Quality checks */}
      <ul className="mt-5 space-y-2" aria-label={t('documents.scan.checksLabel', 'Photo checks')}>
        {CHECKS.map((c, i) => {
          const s = checks[i];
          return (
            <li key={c.key} className="flex items-center gap-3 min-h-[40px]">
              <span className="w-7 h-7 grid place-items-center shrink-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={s} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={spring.snappy}>
                    {s === 'wait' && <span className="block w-5 h-5 rounded-full border-2 border-line-strong" />}
                    {s === 'run' && <CircleNotch size={22} className="animate-spin text-neel" />}
                    {s === 'pass' && <CheckCircle size={24} weight="fill" className="text-patti" />}
                    {s === 'fail' && <XCircle size={24} weight="fill" className="text-sindoor" />}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span className={cx('font-medium', s === 'wait' ? 'text-ink-3' : s === 'fail' ? 'text-sindoor' : 'text-ink')}>{t(c.key, c.fallback)}</span>
            </li>
          );
        })}
      </ul>

      <AnimatePresence mode="wait">
        {phase === 'failed' && (
          <motion.div
            key="fail"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex gap-3 p-4 rounded-md bg-kesar-tint text-ink"
            role="alert"
          >
            <Lightbulb size={24} weight="duotone" className="text-kesar shrink-0" />
            <div>
              <p className="font-semibold">{t('documents.scan.failedTitle', 'The bank seal and IFSC code are hard to read')}</p>
              <p className="text-small text-ink-2 mt-1">{t('documents.scan.failedTip', 'Move away from the window or light, tilt the passbook a little, and try again.')}</p>
            </div>
          </motion.div>
        )}
        {phase === 'passed' && (
          <motion.div key="pass" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-4 p-4 rounded-md bg-patti-tint">
            <p className="font-semibold text-patti">{t('documents.scan.passedTitle', 'This photo will be accepted')}</p>
            <p className="text-small text-ink-2 mt-1">{t('documents.scan.passedBody', 'Your paper is saved on this phone only. You choose when to share it.')}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {cameraError && phase === 'frame' && (
        <p className="mt-3 text-small text-ink-2" role="status">
          {t('documents.scan.cameraBlocked', 'Camera is not available. You can still choose a photo from your gallery.')}
        </p>
      )}

      {/* Actions */}
      <div className="mt-6 flex flex-col gap-2">
        {phase === 'frame' && (
          <>
            <Button size="lg" block onClick={runChecks} iconStart={<Camera size={22} weight="fill" />}>
              {t('documents.scan.capture', 'Take photo')}
            </Button>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-2">
              {!cameraOn && (
                <Button variant="secondary" onClick={startCamera} iconStart={<VideoCamera size={20} />}>
                  {t('documents.scan.useCamera', 'Use my camera')}
                </Button>
              )}
              <label className="relative inline-flex items-center justify-center gap-2 h-12 px-5 rounded-md bg-surface shadow-hair hover:bg-sunken font-semibold cursor-pointer focus-within:outline focus-within:outline-[3px] focus-within:outline-neel">
                <ImageSquare size={20} />
                <span>{t('documents.scan.gallery', 'Choose a photo or PDF')}</span>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setFileName(f.name);
                      runChecks();
                    }
                    e.target.value = '';
                  }}
                />
              </label>
            </div>
          </>
        )}
        {phase === 'failed' && (
          <Button size="lg" block onClick={retake} iconStart={<ArrowClockwise size={20} weight="bold" />}>
            {t('documents.scan.retake', 'Take it again')}
          </Button>
        )}
        {phase === 'passed' && (
          <div className="grid grid-cols-1 xs:grid-cols-[auto_1fr] gap-2">
            <Button variant="secondary" size="lg" onClick={retake}>
              {t('documents.scan.retakeShort', 'Retake')}
            </Button>
            <Button size="lg" onClick={confirm} iconStart={<CheckCircle size={22} weight="fill" />}>
              {t('documents.scan.use', 'Use this photo')}
            </Button>
          </div>
        )}
      </div>
    </Sheet>
  );
};

export default UploadConfirmationModal;
