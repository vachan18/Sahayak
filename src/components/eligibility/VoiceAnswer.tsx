import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Microphone, Stop, ArrowClockwise, Check } from '@phosphor-icons/react';
import { useTranslation } from '../../hooks/useTranslation';
import { useSpeechRecognition, SpeechErrorCode } from '../../hooks/useSpeechRecognition';
import { matchTranscriptToOption } from '../../utils/voiceMatcher';
import { speakVernacularText } from '../../utils/audioSpeech';
import type { EligibilityQuestion, QuestionOption } from '../../types';
import { Button, cx } from '../../ui';
import { haptic } from '../../lib/haptics';

type Phase = 'idle' | 'listening' | 'confirm' | 'error';

function errorKey(e: SpeechErrorCode | 'nomatch') {
  switch (e) {
    case 'unsupported':
      return ['eligibility.voice.unsupported', 'Voice is not available in this browser. Please tap an answer instead.'];
    case 'not-allowed':
      return ['eligibility.voice.denied', 'Microphone access was blocked.'];
    case 'no-speech':
      return ['eligibility.voice.noSpeech', 'We did not hear anything. Please try again.'];
    case 'nomatch':
      return ['eligibility.voice.noMatch', 'We could not match that to an answer.'];
    default:
      return ['eligibility.voice.error', 'Something went wrong with the microphone.'];
  }
}

/**
 * Answer by voice, with a human-style confirmation.
 * We never auto-pick from speech: the person hears and sees "Did you mean …?" and confirms.
 */
export function VoiceAnswer({ question, onConfirm }: { question: EligibilityQuestion; onConfirm: (o: QuestionOption) => void }) {
  const { t, language } = useTranslation();
  const [phase, setPhase] = useState<Phase>('idle');
  const [candidate, setCandidate] = useState<QuestionOption | null>(null);
  const [heard, setHeard] = useState('');
  const [err, setErr] = useState<SpeechErrorCode | 'nomatch' | null>(null);

  const { isListening, interimTranscript, error, startListening, stopListening, reset } = useSpeechRecognition({
    language,
    onFinalResult: (transcript: string) => {
      setHeard(transcript);
      // Match against the localised labels the person actually sees, then the raw keys
      const localised = { ...question, options: (question.options ?? []).map((o) => ({ ...o, labelKey: t(o.labelKey), sublabelKey: o.sublabelKey ? t(o.sublabelKey) : undefined })) };
      const hit = matchTranscriptToOption(transcript, localised) ?? matchTranscriptToOption(transcript, question);
      const original = hit ? (question.options ?? []).find((o) => o.value === hit.value) ?? null : null;
      if (original) {
        setCandidate(original);
        setPhase('confirm');
        haptic('success');
        speakVernacularText(`${t('eligibility.voice.didYouMean', 'Did you mean')} ${t(original.labelKey)}?`, language);
      } else {
        setErr('nomatch');
        setPhase('error');
        haptic('warning');
      }
    },
  });

  // Reset whenever the question changes
  useEffect(() => {
    stopListening();
    reset();
    setPhase('idle');
    setCandidate(null);
    setHeard('');
    setErr(null);
  }, [question.id, stopListening, reset]);

  useEffect(() => {
    if (error) {
      setErr(error);
      setPhase('error');
    }
  }, [error]);

  useEffect(() => {
    if (!isListening && phase === 'listening' && !heard && !error) {
      // ended with nothing — wait a tick for a final result before declaring silence
      const id = window.setTimeout(() => {
        setPhase((p) => (p === 'listening' ? 'idle' : p));
      }, 600);
      return () => window.clearTimeout(id);
    }
  }, [isListening, phase, heard, error]);

  const start = () => {
    haptic('select');
    setErr(null);
    setCandidate(null);
    setHeard('');
    const ok = startListening();
    if (ok === false) {
      setErr('unsupported');
      setPhase('error');
      return;
    }
    setPhase('listening');
  };

  return (
    <div className="rounded-lg bg-sunken p-3" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        {phase === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <button type="button" onClick={start} className="w-full flex items-center gap-3 min-h-[56px] px-2 rounded-md text-start hover:bg-surface/60 transition-colors">
              <span className="w-11 h-11 rounded-full bg-haldi text-[#111E33] grid place-items-center shrink-0">
                <Microphone size={22} weight="fill" />
              </span>
              <span className="font-semibold">{t('eligibility.voice.cta', 'Answer by speaking')}</span>
            </button>
          </motion.div>
        )}

        {phase === 'listening' && (
          <motion.div key="listening" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 min-h-[56px] px-2">
            <span className="relative w-11 h-11 rounded-full bg-haldi text-[#111E33] grid place-items-center shrink-0">
              <span className="absolute inset-0 rounded-full border-2 border-haldi animate-ring-out" aria-hidden />
              <Microphone size={22} weight="fill" className="relative" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-semibold">{t('eligibility.voice.listening', 'Listening… speak now')}</span>
              <span className={cx('block text-small truncate', interimTranscript ? 'text-ink' : 'text-ink-3')}>{interimTranscript || '…'}</span>
            </span>
            <Button variant="secondary" size="sm" iconStart={<Stop size={16} weight="fill" />} onClick={() => { stopListening(); setPhase('idle'); }}>
              {t('eligibility.voice.stop', 'Stop')}
            </Button>
          </motion.div>
        )}

        {phase === 'confirm' && candidate && (
          <motion.div key="confirm" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-2 space-y-3">
            <p className="text-small text-ink-2">
              {t('eligibility.voice.heard', 'We heard')}: <span className="text-ink font-medium">“{heard}”</span>
            </p>
            <p className="text-lead font-semibold">
              {t('eligibility.voice.didYouMean', 'Did you mean')} <span className="text-neel-ink">{t(candidate.labelKey)}</span>?
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="solid" iconStart={<Check size={18} weight="bold" />} onClick={() => onConfirm(candidate)}>
                {t('eligibility.voice.yes', 'Yes, that’s right')}
              </Button>
              <Button variant="secondary" iconStart={<ArrowClockwise size={18} />} onClick={start}>
                {t('eligibility.voice.no', 'No, try again')}
              </Button>
            </div>
          </motion.div>
        )}

        {phase === 'error' && err && (
          <motion.div key="error" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col sm:flex-row sm:items-center gap-3 p-2">
            <p className="flex-1 text-small text-ink-2" role="alert">
              {heard && <span className="block text-ink">“{heard}”</span>}
              {t(errorKey(err)[0], errorKey(err)[1])}
            </p>
            {err !== 'unsupported' && (
              <Button variant="secondary" size="sm" iconStart={<ArrowClockwise size={16} />} onClick={start}>
                {t('eligibility.voice.no', 'Try again')}
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
