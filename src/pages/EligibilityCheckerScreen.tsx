import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ArrowCounterClockwise, Lock, Info, PencilSimple } from '@phosphor-icons/react';
import { eligibilityQuestions } from '../data/questions';
import type { EligibilityQuestion, QuestionOption } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { speakVernacularText, stopSpeech } from '../utils/audioSpeech';
import { haptic } from '../lib/haptics';
import { Avatar, displayName } from '../components/shell/FamilySwitcher';
import { OptionCard } from '../components/eligibility/OptionCard';
import { VoiceAnswer } from '../components/eligibility/VoiceAnswer';
import { Button, ListenButton, cx, ease, dur } from '../ui';

type Answers = Record<string, unknown>;

const answerOf = (answers: Answers, q: EligibilityQuestion) => answers[q.fieldName];

/** Progress as a row of thread segments — one per question, filled as you go. */
function ProgressThread({ total, current, answered }: { total: number; current: number; answered: boolean[] }) {
  return (
    <div className="flex items-center gap-1.5" aria-hidden>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} className="relative flex-1 h-1.5 rounded-full bg-line overflow-hidden">
          <motion.span
            className={cx('absolute inset-y-0 start-0 rounded-full', i === current ? 'bg-haldi' : 'bg-patti')}
            initial={false}
            animate={{ width: i < current || (answered[i] && i !== current) ? '100%' : i === current ? '45%' : '0%' }}
            transition={{ duration: dur.medium, ease: ease.out }}
          />
        </span>
      ))}
    </div>
  );
}

const slide = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40 }),
  center: { opacity: 1, x: 0, transition: { duration: dur.medium, ease: ease.out } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -24, transition: { duration: dur.short * 0.8, ease: ease.in } }),
};

export const EligibilityCheckerScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, language } = useTranslation();
  const { eligibilityAnswers, setEligibilityAnswer, resetEligibilityAnswers, isAudioAssistanceEnabled, profiles, activeProfileId } = useAppStore();
  const answers = eligibilityAnswers as Answers;
  const profileIndex = Math.max(0, profiles.findIndex((p) => p.id === activeProfileId));
  const profile = profiles[profileIndex];
  const rtl = typeof document !== 'undefined' && document.documentElement.dir === 'rtl';

  const questions = useMemo(() => eligibilityQuestions.filter((q) => !q.condition || q.condition(answers)), [answers]);

  // Resume where the person left off, or jump to a question from the results "Change" link
  const initialStep = useMemo(() => {
    const requested = (location.state as { step?: number } | null)?.step;
    if (typeof requested === 'number') return requested;
    const firstOpen = questions.findIndex((q) => answerOf(answers, q) === undefined);
    return firstOpen === -1 ? 0 : firstOpen;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [step, setStep] = useState(initialStep);
  const [dir, setDir] = useState(1);
  const safeStep = Math.min(step, questions.length - 1);
  const question = questions[safeStep];
  const total = questions.length;
  const isLast = safeStep === total - 1;
  const current = answerOf(answers, question);
  const advanceTimer = useRef<number>();
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const questionText = t(question.textKey);
  const helpText = question.helpKey ? t(question.helpKey) : '';

  // Read each question aloud when read-aloud is on
  useEffect(() => {
    if (!isAudioAssistanceEnabled) return;
    const id = window.setTimeout(() => speakVernacularText(questionText, language), 380);
    return () => window.clearTimeout(id);
  }, [question.id, isAudioAssistanceEnabled, language, questionText]);

  useEffect(() => () => {
    window.clearTimeout(advanceTimer.current);
    stopSpeech();
  }, []);

  const go = (next: number) => {
    window.clearTimeout(advanceTimer.current);
    stopSpeech();
    setDir((next > safeStep ? 1 : -1) * (rtl ? -1 : 1));
    setStep(next);
  };

  const finish = () => {
    stopSpeech();
    haptic('success');
    navigate('/eligibility/results');
  };

  const choose = (opt: QuestionOption) => {
    haptic('select');
    setEligibilityAnswer(question.fieldName, opt.value);
    if (opt.payload) Object.entries(opt.payload).forEach(([k, v]) => setEligibilityAnswer(k, v));
    window.clearTimeout(advanceTimer.current);
    advanceTimer.current = window.setTimeout(() => {
      // Re-evaluate conditional questions with the new answer before deciding where to go
      const nextAnswers = { ...answers, [question.fieldName]: opt.value, ...(opt.payload ?? {}) };
      const nextQuestions = eligibilityQuestions.filter((q) => !q.condition || q.condition(nextAnswers));
      const idx = nextQuestions.findIndex((q) => q.id === question.id);
      if (idx >= nextQuestions.length - 1) finish();
      else go(idx + 1);
    }, 380);
  };

  const options = question.options ?? [];
  const selectedIndex = options.findIndex((o) => o.value === current);

  const onOptionKey = (e: React.KeyboardEvent, i: number) => {
    const n = options.length;
    let target = -1;
    if (e.key === 'ArrowDown' || e.key === (rtl ? 'ArrowLeft' : 'ArrowRight')) target = (i + 1) % n;
    if (e.key === 'ArrowUp' || e.key === (rtl ? 'ArrowRight' : 'ArrowLeft')) target = (i - 1 + n) % n;
    if (target >= 0) {
      e.preventDefault();
      optionRefs.current[target]?.focus();
    }
  };

  // Number-key shortcuts for CSC operators: 1–9 picks an answer
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= options.length) choose(options[n - 1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const answered = questions.map((q) => answerOf(answers, q) !== undefined);
  const labelFor = (q: EligibilityQuestion) => {
    const v = answerOf(answers, q);
    const o = q.options?.find((x) => x.value === v);
    return o ? t(o.labelKey) : null;
  };

  return (
    <div className="pt-2 lg:pt-4 pb-6">
      {/* Context bar: who we're checking for + start over */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar profile={profile} index={profileIndex} size={36} />
          <p className="min-w-0 leading-tight">
            <span className="block text-micro text-ink-3">{t('eligibility.checker.checkingFor', 'Checking for')}</span>
            <span className="block text-small font-semibold truncate">{displayName(profile)}</span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconStart={<ArrowCounterClockwise size={18} />}
          onClick={() => {
            resetEligibilityAnswers();
            go(0);
          }}
        >
          {t('eligibility.checker.startOver', 'Start over')}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-8 lg:gap-12 items-start">
        <section aria-labelledby="question-title" className="min-w-0">
          <ProgressThread total={total} current={safeStep} answered={answered} />
          <p className="mt-3 text-small font-semibold text-ink-3" aria-live="polite">
            {t('eligibility.checker.step', 'Question')} <span className="num">{safeStep + 1}</span> {t('eligibility.checker.of', 'of')} <span className="num">{total}</span>
          </p>

          <div className="relative mt-4">
            <AnimatePresence mode="wait" custom={dir} initial={false}>
              <motion.div key={question.id} custom={dir} variants={slide} initial="enter" animate="center" exit="exit">
                <div className="flex items-start gap-3">
                  <h1 id="question-title" className="flex-1 text-h1 font-semibold">
                    {questionText}
                  </h1>
                  <ListenButton variant="icon" text={helpText ? `${questionText}. ${helpText}` : questionText} className="mt-1" />
                </div>
                {helpText && <p className="mt-3 text-ink-2 max-w-2xl">{helpText}</p>}

                <div className="mt-5">
                  <VoiceAnswer question={question} onConfirm={choose} />
                </div>

                <div role="radiogroup" aria-labelledby="question-title" className={cx('mt-4 grid grid-cols-1 gap-3', options.length > 3 && 'md:grid-cols-2')}>
                  {options.map((opt, i) => (
                    <motion.div key={String(opt.value)} className="h-full" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.06 + i * 0.04, duration: dur.medium, ease: ease.out } }}>
                      <OptionCard
                        ref={(el) => (optionRefs.current[i] = el)}
                        option={opt}
                        fieldName={question.fieldName}
                        label={t(opt.labelKey)}
                        sublabel={opt.sublabelKey ? t(opt.sublabelKey) : undefined}
                        selected={opt.value === current}
                        index={i}
                        tabIndex={selectedIndex === -1 ? (i === 0 ? 0 : -1) : i === selectedIndex ? 0 : -1}
                        onSelect={() => choose(opt)}
                        onKeyDown={(e) => onOptionKey(e, i)}
                      />
                    </motion.div>
                  ))}
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <Button variant="ghost" iconStart={<ArrowLeft size={20} weight="bold" className="flip-rtl" />} onClick={() => (safeStep > 0 ? go(safeStep - 1) : navigate(-1))}>
              {t('eligibility.checker.back', 'Back')}
            </Button>
            {current !== undefined && (
              <Button variant={isLast ? 'primary' : 'solid'} iconEnd={<ArrowRight size={20} weight="bold" className="flip-rtl" />} onClick={() => (isLast ? finish() : go(safeStep + 1))}>
                {isLast ? t('eligibility.checker.seeResults', 'See my results') : t('eligibility.checker.next', 'Next')}
              </Button>
            )}
          </div>
          <p className="hidden lg:block mt-4 text-micro text-ink-3">{t('eligibility.checker.keyboardHint')}</p>
        </section>

        {/* Desktop companion column: recap + reassurance */}
        <aside className="hidden lg:block space-y-4 lg:sticky lg:top-[calc(var(--topbar-h)+16px)]">
          <div className="rounded-lg bg-surface shadow-hair p-5">
            <h2 className="font-semibold">{t('eligibility.checker.answersTitle', 'Your answers so far')}</h2>
            <ol className="mt-3 space-y-1">
              {questions.map((q, i) => {
                const label = labelFor(q);
                const isCurrent = i === safeStep;
                return (
                  <li key={q.id}>
                    <button
                      type="button"
                      onClick={() => go(i)}
                      aria-current={isCurrent ? 'step' : undefined}
                      className={cx('w-full flex items-start gap-3 p-2 -mx-2 rounded-md text-start transition-colors', isCurrent ? 'bg-sunken' : 'hover:bg-sunken/70')}
                    >
                      <span className={cx('mt-0.5 w-6 h-6 rounded-full grid place-items-center shrink-0 num text-micro font-semibold', label ? 'bg-patti text-white' : isCurrent ? 'bg-ink text-paper' : 'bg-sunken text-ink-3 shadow-hair')}>
                        {i + 1}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-micro text-ink-3 line-clamp-1">{t(q.textKey)}</span>
                        <span className={cx('block text-small line-clamp-2', label ? 'font-medium text-ink' : 'text-ink-3')}>{label ?? t('eligibility.checker.notAnswered', 'Not answered yet')}</span>
                      </span>
                      {label && <PencilSimple size={16} className="mt-1 text-ink-3 shrink-0" aria-label={t('eligibility.checker.edit', 'Change')} />}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="rounded-lg bg-patti-tint p-5 flex gap-3">
            <Lock size={22} weight="duotone" className="text-patti shrink-0" />
            <div>
              <p className="font-semibold">{t('eligibility.checker.privacyTitle', 'Your answers stay on this phone')}</p>
              <p className="mt-1 text-small text-ink-2">{t('eligibility.checker.privacyBody')}</p>
            </div>
          </div>
        </aside>

        {/* Phone: reassurance under the question */}
        <p className="lg:hidden flex items-start gap-2 text-small text-ink-2">
          <Info size={18} className="shrink-0 mt-0.5 text-patti" />
          {t('eligibility.checker.privacyBody')}
        </p>
      </div>
    </div>
  );
};

export default EligibilityCheckerScreen;
