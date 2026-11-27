import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Microphone,
  MagnifyingGlass,
  ArrowRight,
  CalendarPlus,
  ShieldCheck,
  MapPin,
  Warning,
  Clock,
  HandCoins,
  FirstAidKit,
  Coins,
  ArrowClockwise,
  Translate,
  Stack,
} from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { assessEligibility } from '../services/eligibilityEngine';
import { speakVernacularText } from '../utils/audioSpeech';
import { LANGUAGE_META } from '../data/languages';
import { lifeEventsData } from '../data/lifeEvents';
import { SupportedLanguage, LifeEventId } from '../types';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { displayName } from '../components/shell/FamilySwitcher';
import { downloadReminder } from '../lib/calendar';
import { haptic } from '../lib/haptics';
import {
  JourneyThread,
  useJourney,
  LinkButton,
  Button,
  Surface,
  Tag,
  ListenButton,
  LIFE_EVENT,
  AnimatedNumber,
  ProgressBar,
  SectionHeader,
  Reveal,
  RevealItem,
  toneText,
  cx,
  Photo,
  LIFE_EVENT_PHOTO,
  SplitText,
  riseIn,
  staggerParent,
} from '../ui';

const WELCOME_SESSION_KEY = 'sahayak_welcome_spoken';

/* ── Speak the welcome once per session (after the first user gesture, per browser autoplay rules) ── */
function useWelcomeVoice(language: SupportedLanguage, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    try {
      if (window.sessionStorage.getItem(WELCOME_SESSION_KEY) === '1') return;
    } catch {
      /* storage blocked */
    }
    const greeting = (LANGUAGE_META[language] || LANGUAGE_META.en).welcomeVoice;
    const markSpoken = () => {
      try {
        window.sessionStorage.setItem(WELCOME_SESSION_KEY, '1');
      } catch {
        /* ignore */
      }
    };
    const onFirst = () => {
      markSpoken();
      speakVernacularText(greeting, language);
    };
    const hasActivation = Boolean((navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation?.hasBeenActive);
    if (hasActivation) {
      markSpoken();
      speakVernacularText(greeting, language, undefined, (reason) => {
        if (reason === 'not-allowed') {
          try {
            window.sessionStorage.removeItem(WELCOME_SESSION_KEY);
          } catch {
            /* ignore */
          }
          window.addEventListener('pointerdown', onFirst, { once: true });
        }
      });
      return;
    }
    window.addEventListener('pointerdown', onFirst, { once: true });
    window.addEventListener('keydown', onFirst, { once: true });
    return () => {
      window.removeEventListener('pointerdown', onFirst);
      window.removeEventListener('keydown', onFirst);
    };
  }, [enabled, language]);
}

function greetingKey() {
  const h = new Date().getHours();
  return h < 12 ? 'home.greeting.morning' : h < 17 ? 'home.greeting.afternoon' : 'home.greeting.evening';
}

/* ── Voice hero ───────────────────────────────────────────────────────────── */
function VoiceHero() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAiDrawerOpen } = useAppStore();
  const [q, setQ] = useState('');
  const [exampleIndex, setExampleIndex] = useState(0);
  const examples = ['home.voice.example1', 'home.voice.example2', 'home.voice.example3', 'home.voice.example4'];

  useEffect(() => {
    const id = window.setInterval(() => setExampleIndex((i) => (i + 1) % examples.length), 3200);
    return () => window.clearInterval(id);
  }, [examples.length]);

  return (
    <motion.section variants={riseIn} aria-labelledby="voice-cta" className="relative overflow-hidden rounded-xl bg-hero-neel text-on-hero">
      {/* Real people: a farmer at the edge of his field, blended into the brand navy */}
      <Photo id="farmer" priority decorative parallax rounded="" sizes="(min-width: 1024px) 34vw, 100vw" className="!absolute inset-x-0 top-0 h-52 sm:h-auto sm:inset-y-0 sm:start-auto sm:end-0 sm:w-[50%]" />
      <div aria-hidden className="sm:hidden absolute inset-x-0 top-0 h-52 bg-gradient-to-b from-[rgb(var(--c-hero-neel)/0.05)] via-[rgb(var(--c-hero-neel)/0.35)] to-[rgb(var(--c-hero-neel))]" />
      <div aria-hidden className="hidden sm:block absolute inset-y-0 end-0 w-[50%] ltr:bg-gradient-to-r rtl:bg-gradient-to-l from-hero-neel via-hero-neel/40 to-transparent" />
      <div className="relative pt-36 sm:pt-8 p-6 sm:p-8 lg:p-10 flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 sm:max-w-[60%] xl:max-w-[56%]">
        <motion.button
          type="button"
          whileTap={{ scale: 0.93 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => {
            haptic('select');
            setAiDrawerOpen(true);
          }}
          aria-labelledby="voice-cta"
          className="relative shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-haldi text-[#111E33] grid place-items-center self-start sm:self-auto"
        >
          <span className="absolute inset-0 rounded-full border-2 border-haldi animate-ring-out" aria-hidden />
          <span className="absolute inset-0 rounded-full border-2 border-haldi animate-ring-out [animation-delay:0.9s]" aria-hidden />
          <Microphone size={44} weight="fill" className="relative" />
        </motion.button>

        <div className="flex-1 min-w-0">
          <h2 id="voice-cta" className="text-h2 font-semibold">
            {t('home.voice.cta', 'Tap and speak')}
          </h2>
          <p className="mt-1.5 text-on-hero/80">{t('home.voice.sub')}</p>
          <p className="mt-4 text-small text-on-hero/70 h-7 flex items-center gap-2 overflow-hidden">
            <span className="shrink-0">{t('home.voice.try', 'Try saying')}</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={exampleIndex}
                initial={{ y: 14, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -14, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
                className="font-semibold text-on-hero truncate"
              >
                {t(examples[exampleIndex])}
              </motion.span>
            </AnimatePresence>
          </p>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) navigate(`/schemes?q=${encodeURIComponent(q.trim())}`);
            }}
            className="mt-5 flex items-center gap-2 max-w-xl"
          >
            <label className="relative flex-1">
              <span className="sr-only">{t('home.search.placeholder')}</span>
              <MagnifyingGlass size={20} className="absolute start-4 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('home.search.placeholder', 'Or type a few words…')}
                className="w-full h-[52px] ps-12 pe-4 rounded-md bg-surface text-ink placeholder:text-ink-3 focus:outline-none focus:shadow-[0_0_0_3px_rgb(var(--c-haldi))]"
              />
            </label>
            <Button type="submit" variant="secondary" className="h-[52px] !bg-white/10 !text-on-hero !shadow-none hover:!bg-white/20" aria-label={t('home.search.submit', 'Search')}>
              <ArrowRight size={20} weight="bold" className="flip-rtl" />
            </Button>
          </form>
        </div>
      </div>
    </motion.section>
  );
}


/* ── Trust strip — four facts, counted up once ─────────────────────────────── */
function TrustStrip() {
  const { t } = useTranslation();
  const { schemes } = useAppStore();
  const facts: { value: number; prefix?: string; suffix?: string; label: string; icon: React.ReactNode }[] = [
    { value: 13, label: t('home.trust.languages', 'Indian languages'), icon: <Translate size={22} weight="duotone" /> },
    { value: schemes.length, label: t('home.trust.schemes', 'schemes, in plain words'), icon: <Stack size={22} weight="duotone" /> },
    { value: 0, prefix: '₹', label: t('home.trust.fee', 'government fee to apply'), icon: <ShieldCheck size={22} weight="duotone" /> },
    { value: 2, suffix: t('home.trust.minUnit', ' min'), label: t('home.trust.check', 'to check what you can get'), icon: <Clock size={22} weight="duotone" /> },
  ];
  return (
    <motion.ul variants={riseIn} className="grid grid-cols-2 lg:grid-cols-4 rounded-lg bg-surface shadow-hair divide-line [&>li]:border-line [&>li:nth-child(odd)]:border-e [&>li:nth-child(-n+2)]:border-b lg:[&>li]:!border-b-0 lg:[&>li:not(:last-child)]:border-e">
      {facts.map((f) => (
        <li key={f.label} className="flex items-center gap-3 p-4 md:p-5 min-w-0">
          <span className="w-11 h-11 shrink-0 rounded-md bg-neel-tint text-neel-ink grid place-items-center">{f.icon}</span>
          <span className="min-w-0">
            <span className="block text-h3 font-bold leading-none">
              <AnimatedNumber value={f.value} prefix={f.prefix ?? ''} />
              {f.suffix && <span className="text-small font-semibold text-ink-2">{f.suffix}</span>}
            </span>
            <span className="block mt-1 text-micro text-ink-2 leading-snug">{f.label}</span>
          </span>
        </li>
      ))}
    </motion.ul>
  );
}

/* ── Journey + next step ──────────────────────────────────────────────────── */
function NextStep() {
  const { t } = useTranslation();
  const { steps, currentIndex } = useJourney();
  const step = steps[currentIndex];
  return (
    <motion.section variants={riseIn} aria-labelledby="next-step" className="rounded-xl bg-surface shadow-hair p-6 lg:p-7 flex flex-col">
      <h2 id="next-step" className="text-small font-semibold text-ink-3">
        {t('home.next.title', 'Your next step')}
      </h2>
      <p className="mt-2 text-h3 font-semibold">{t(`home.next.${step.id}`)}</p>
      <p className="mt-1 flex items-center gap-1.5 text-small text-ink-2">
        <Clock size={16} /> {t('home.next.time', 'About 2 minutes')}
      </p>
      <JourneyThread className="mt-6" />
      <div className="mt-6 lg:mt-auto lg:pt-6">
        <LinkButton to={step.to} variant="solid" block iconEnd={<ArrowRight size={20} weight="bold" className="flip-rtl" />}>
          {t('home.next.go', 'Continue')}
        </LinkButton>
      </div>
    </motion.section>
  );
}

/* ── Entitlement band — the most important number in the app ───────────────── */
function EntitlementBand() {
  const { t } = useTranslation();
  const { eligibilityAnswers, eligibilityStatus } = useAppStore();
  const result = useMemo(() => assessEligibility(eligibilityAnswers), [eligibilityAnswers]);
  const benefits = result.categorizedBenefits;

  if (eligibilityStatus === 'not_assessed' || Object.keys(eligibilityAnswers).length === 0) {
    return (
      <Surface as="section" padded="lg" className="h-full flex flex-col justify-between gap-6" aria-labelledby="ent-empty">
        <div>
          <h2 id="ent-empty" className="text-h2 font-semibold">
            {t('home.ent.emptyTitle', 'Find out what your family is entitled to')}
          </h2>
          <p className="mt-2 text-ink-2 max-w-xl">{t('home.ent.emptyBody')}</p>
          <ol className="mt-5 flex flex-wrap gap-2" aria-hidden>
            {['home.ent.q1', 'home.ent.q2', 'home.ent.q3', 'home.ent.q4'].map((k, i) => (
              <li key={k} className="flex items-center gap-2 h-9 ps-1.5 pe-3 rounded-full bg-sunken text-small text-ink-2">
                <span className="w-6 h-6 rounded-full bg-surface grid place-items-center num text-micro font-semibold">{i + 1}</span>
                <span className="truncate max-w-[10rem]">{t(k, '…')}</span>
              </li>
            ))}
          </ol>
        </div>
        <LinkButton to="/eligibility" size="lg" className="self-start" iconEnd={<ArrowRight size={20} weight="bold" className="flip-rtl" />}>
          {t('home.ent.emptyCta', 'Start the 2-minute check')}
        </LinkButton>
      </Surface>
    );
  }

  if (eligibilityStatus === 'in_progress') {
    return (
      <Surface as="section" padded="lg" className="flex flex-col md:flex-row md:items-center gap-6" aria-labelledby="ent-progress">
        <div className="flex-1">
          <Tag tone="kesar">{t('statusInProgress', 'In progress')}</Tag>
          <h2 id="ent-progress" className="mt-3 text-h2 font-semibold">
            {t('home.ent.progressTitle', 'You were half-way through')}
          </h2>
          <p className="mt-2 text-ink-2">{t('home.ent.progressBody')}</p>
        </div>
        <LinkButton to="/eligibility" size="lg">
          {t('home.ent.resume', 'Continue the check')}
        </LinkButton>
      </Surface>
    );
  }

  if (result.eligibleSchemes.length === 0) {
    return (
      <Surface as="section" padded="lg" className="flex flex-col md:flex-row md:items-center gap-6" aria-labelledby="ent-none">
        <div className="flex-1">
          <h2 id="ent-none" className="text-h2 font-semibold">
            {t('home.ent.noneTitle', 'No exact match yet')}
          </h2>
          <p className="mt-2 text-ink-2">{t('home.ent.noneBody')}</p>
        </div>
        <LinkButton to="/eligibility/results" variant="secondary" size="lg">
          {t('home.ent.see', 'See the full breakdown')}
        </LinkButton>
      </Surface>
    );
  }

  const extras = [
    benefits.healthInsuranceCoverTotal > 0 && { icon: FirstAidKit, value: benefits.healthInsuranceCoverTotal, label: t('home.ent.healthCover', 'free hospital cover') },
    benefits.loanCreditFacilityTotal > 0 && { icon: Coins, value: benefits.loanCreditFacilityTotal, label: t('home.ent.credit', 'low-interest loans') },
  ].filter(Boolean) as { icon: typeof Coins; value: number; label: string }[];

  return (
    <motion.section variants={riseIn} aria-labelledby="ent-title" className="relative overflow-hidden rounded-xl bg-hero-patti text-white">
      <div className="relative p-6 sm:p-8 lg:p-10 grid lg:grid-cols-[1.2fr_1fr] gap-8 items-end">
        <div>
          <p id="ent-title" className="font-semibold text-white/85">
            {t('home.ent.eyebrow', 'Your family could receive')}
          </p>
          <p className="mt-2 flex items-baseline gap-3 flex-wrap">
            <AnimatedNumber value={result.totalAnnualCashBenefit || result.totalAnnualBenefitValue} className="text-display font-semibold num-display" />
            <span className="text-lead text-white/85">{t('home.ent.perYear', 'every year, in cash')}</span>
          </p>
          <p className="mt-4 text-small text-white/75 max-w-lg">{t('home.ent.disclaimer')}</p>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md bg-white/12 p-4">
              <HandCoins size={22} weight="duotone" />
              <p className="mt-2 text-h3 font-semibold num">{result.eligibleSchemes.length}</p>
              <p className="text-small text-white/80">{t('home.ent.schemes', 'schemes matched')}</p>
            </div>
            {extras.slice(0, 1).map((e) => (
              <div key={e.label} className="rounded-md bg-white/12 p-4">
                <e.icon size={22} weight="duotone" />
                <p className="mt-2 text-h3 font-semibold">
                  <AnimatedNumber value={e.value} short />
                </p>
                <p className="text-small text-white/80">{e.label}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            <LinkButton to="/eligibility/results" variant="primary" className="flex-1" iconEnd={<ArrowRight size={20} weight="bold" className="flip-rtl" />}>
              {t('home.ent.see', 'See the full breakdown')}
            </LinkButton>
            <LinkButton to="/eligibility" variant="ghost" className="!text-white hover:!bg-white/10" iconStart={<ArrowClockwise size={18} />}>
              {t('home.ent.recheck', 'Check again')}
            </LinkButton>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

/* ── Deadline (seasonal) ──────────────────────────────────────────────────── */
function DeadlineCard() {
  const { t } = useTranslation();
  const { pushToast } = useAppStore();
  const daysLeft = 12;
  const title = t('home.deadline.title', 'Kharif crop support enrolment');
  const body = t('home.deadline.body');
  return (
    <Surface as="section" aria-labelledby="deadline" className="flex flex-col">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-[76px] rounded-md overflow-hidden text-center shadow-hair" aria-hidden>
          <div className="bg-kesar text-white text-micro font-semibold py-1">{t('home.deadline.eyebrow', 'Closing soon')}</div>
          <div className="bg-surface py-2">
            <p className="text-[2rem] leading-none font-semibold num">{daysLeft}</p>
            <p className="text-micro text-ink-3 mt-1">{t('home.deadline.daysLeft', 'days left')}</p>
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="sr-only">
            {daysLeft} {t('home.deadline.daysLeft', 'days left')}
          </p>
          <h2 id="deadline" className="text-h3 font-semibold">
            {title}
          </h2>
          <p className="mt-1 text-small text-ink-2">{body}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2">
        <ListenButton text={`${title}. ${body}`} />
        <Button
          variant="secondary"
          size="sm"
          iconStart={<CalendarPlus size={18} />}
          onClick={() => {
            const d = new Date();
            d.setDate(d.getDate() + daysLeft - 2);
            d.setHours(10, 0, 0, 0);
            downloadReminder({ title, description: body, date: d });
            pushToast({ message: t('home.deadline.reminded', 'Reminder added to your calendar'), tone: 'success' });
          }}
        >
          {t('home.deadline.remind', 'Remind me')}
        </Button>
        <Link to="/schemes/pm-kisan" className="ms-auto inline-flex items-center gap-1 h-10 text-small font-semibold text-neel-ink hover:underline underline-offset-4">
          {t('home.deadline.open', 'See scheme')}
          <ArrowRight size={16} weight="bold" className="flip-rtl" />
        </Link>
      </div>
    </Surface>
  );
}

/* ── Life needs ───────────────────────────────────────────────────────────── */
function LifeNeeds() {
  const { t } = useTranslation();
  const { schemes } = useAppStore();
  return (
    <section aria-labelledby="needs">
      <SectionHeader id="needs" title={t('home.needs.title', 'Browse by what is happening in your life')} description={t('home.needs.subtitle')} />
      <Reveal className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4" stagger={0.05}>
        {lifeEventsData.map((ev) => {
          const meta = LIFE_EVENT[ev.id as LifeEventId];
          const count = schemes.filter((s) => s.lifeEventId === ev.id).length;
          return (
            <RevealItem key={ev.id}>
              <Link
                to={`/schemes?category=${ev.id}`}
                className="group h-full flex flex-col rounded-lg bg-surface shadow-hair hover:shadow-lift overflow-hidden transition-[box-shadow,transform] duration-short ease-out hover:-translate-y-0.5 active:scale-[0.98]"
              >
                <div className="relative">
                  <Photo id={LIFE_EVENT_PHOTO[ev.id as LifeEventId]} decorative rounded="" sizes="(min-width: 1024px) 18vw, 45vw" className="aspect-[4/3] w-full [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105" />
                  <span className={cx('absolute top-2.5 start-2.5 num text-micro font-semibold px-2 h-6 rounded-full grid place-items-center bg-surface/95 shadow-hair', toneText[meta.tone])}>
                    {count} {count === 1 ? t('home.needs.countOne', 'scheme') : t('home.needs.count', 'schemes')}
                  </span>
                </div>
                <div className="p-3.5 md:p-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold leading-snug">{t(meta.titleKey)}</h3>
                    <p className="mt-0.5 text-small text-ink-2 line-clamp-2 hidden sm:block">{t(meta.descKey)}</p>
                  </div>
                </div>
              </Link>
            </RevealItem>
          );
        })}
      </Reveal>
    </section>
  );
}

/* ── Picks ────────────────────────────────────────────────────────────────── */
function Picks() {
  const { t } = useTranslation();
  const { schemes, profiles, activeProfileId, eligibilityAnswers } = useAppStore();
  const profile = profiles.find((p) => p.id === activeProfileId) ?? profiles[0];
  const picks = useMemo(() => {
    const assessed = assessEligibility(eligibilityAnswers).eligibleSchemes;
    if (assessed.length) return assessed.slice(0, 3);
    const occ = (profile?.occupation ?? '').toLowerCase();
    const score = (id: string, life: LifeEventId) =>
      (occ === 'farmer' && life === 'farming' ? 3 : 0) +
      (occ === 'student' && life === 'education_youth' ? 3 : 0) +
      (profile?.gender === 'female' && life === 'women_child' ? 2 : 0) +
      (life === 'health_elder' ? 1 : 0) +
      (id === 'pm-jay' ? 1 : 0);
    return [...schemes].sort((a, b) => score(b.id, b.lifeEventId) - score(a.id, a.lifeEventId)).slice(0, 3);
  }, [schemes, profile, eligibilityAnswers]);

  return (
    <section aria-labelledby="picks">
      <SectionHeader
        id="picks"
        title={t('home.picks.title', 'Picked for your family')}
        description={`${t('home.picks.subtitle', 'Based on the person you are checking for')} · ${displayName(profile)}`}
        to="/schemes"
        linkLabel={t('home.picks.all', 'All schemes')}
      />
      {/* Phone: swipeable rail with snap. Desktop: three columns. */}
      <Reveal className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 xl:grid-cols-3 gap-4 overflow-x-auto sm:overflow-visible snap-rail no-scrollbar pb-2">
        {picks.map((s) => (
          <RevealItem key={s.id} className="w-[86%] xs:w-[80%] sm:w-auto shrink-0">
            <SchemeCard scheme={s} />
          </RevealItem>
        ))}
      </Reveal>
    </section>
  );
}


/* ── Built for people like… (personas from our field research — not testimonials) ── */
const PEOPLE: { photo: 'farmer' | 'mother' | 'weaverMan' | 'student'; key: string; to: string }[] = [
  { photo: 'farmer', key: 'ramesh', to: '/schemes?category=farming' },
  { photo: 'mother', key: 'lakshmi', to: '/schemes?category=women_child' },
  { photo: 'weaverMan', key: 'arindam', to: '/schemes?category=business_artisan' },
  { photo: 'student', key: 'sunita', to: '/schemes?category=education_youth' },
];

function BuiltFor() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="builtfor">
      <SectionHeader id="builtfor" title={t('home.people.title', 'Built for people like them')} description={t('home.people.subtitle', 'Sahayak was designed with farmers, mothers, artisans and students across India.')} />
      <Reveal className="-mx-4 px-4 sm:mx-0 sm:px-0 flex sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-4 overflow-x-auto sm:overflow-visible snap-rail no-scrollbar pb-2">
        {PEOPLE.map((p) => (
          <RevealItem key={p.key} className="w-[78%] xs:w-[64%] sm:w-auto shrink-0">
            <Link to={p.to} className="group relative block h-full min-h-[22rem] rounded-lg overflow-hidden bg-hero-neel text-on-hero">
              <Photo id={p.photo} rounded="" sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 78vw" className="!absolute inset-0 [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-105" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[rgb(9_14_25/0.92)] via-[rgb(9_14_25/0.45)] to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-micro font-semibold text-haldi">{t(`home.people.${p.key}.role`)}</p>
                <p className="mt-1 text-h3 font-semibold text-white">{t(`home.people.${p.key}.name`)}</p>
                <p className="mt-2 text-small text-white/85 line-clamp-3">“{t(`home.people.${p.key}.need`)}”</p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-small font-semibold text-white">
                  {t(`home.people.${p.key}.cta`)}
                  <ArrowRight size={16} weight="bold" className="flip-rtl transition-transform group-hover:translate-x-0.5" />
                </p>
              </div>
            </Link>
          </RevealItem>
        ))}
      </Reveal>
      <p className="mt-3 text-micro text-ink-3">{t('home.people.note', 'Illustrative stories based on our user research. Photos: Unsplash.')}</p>
    </section>
  );
}

/* ── Applications in progress ─────────────────────────────────────────────── */
function InProgress() {
  const { t } = useTranslation();
  const { applications } = useAppStore();
  const active = applications.filter((a) => a.statusBadge !== 'disbursed').slice(0, 2);
  if (!active.length) return null;
  return (
    <section aria-labelledby="inprogress">
      <SectionHeader id="inprogress" title={t('home.apps.title', 'In progress')} to="/tracker" linkLabel={t('home.apps.all', 'Track all')} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {active.map((a) => {
          const pct = (a.currentStage / 4) * 100;
          const needsAction = a.statusBadge === 'action_needed' || (a.missingDocuments ?? []).some((d) => !d.resolved);
          return (
            <Link key={a.id} to={`/tracker/${a.id}`} className="group block rounded-lg bg-surface shadow-hair p-5 hover:shadow-lift transition-shadow">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold truncate">{t(a.schemeTitle, a.schemeTitle)}</p>
                  <p className="text-micro text-ink-3 num mt-0.5">{a.tokenNumber}</p>
                </div>
                {needsAction ? (
                  <Tag tone="sindoor" icon={<Warning size={14} weight="fill" />}>
                    {t('home.apps.actionNeeded', 'Needs your action')}
                  </Tag>
                ) : (
                  <Tag tone="neel">{t('home.apps.step', 'Step')} <span className="num">{a.currentStage}/4</span></Tag>
                )}
              </div>
              <ProgressBar value={pct} tone={needsAction ? 'sindoor' : 'patti'} label={t('home.apps.title', 'In progress')} className="mt-5" />
              {a.slaDaysRemaining >= 0 ? (
                <p className="mt-2 text-small text-ink-2">
                  <span className="num font-semibold text-ink">{a.slaDaysRemaining}</span> {t('home.apps.daysLeft', 'days left in the official time limit')}
                </p>
              ) : (
                <p className="mt-2 text-small font-semibold text-sindoor">
                  <span className="num">{Math.abs(a.slaDaysRemaining)}</span> {t('home.apps.overdue', 'days past the official time limit')}
                </p>
              )}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

/* ── The promise (anti-middleman) ─────────────────────────────────────────── */
function Promise() {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="promise" className="rounded-xl bg-haldi-tint p-6 sm:p-8 lg:p-10 grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
      <div>
        <ShieldCheck size={36} weight="duotone" className="text-haldi-deep" />
        <h2 id="promise" className="mt-3 text-h2 font-semibold text-ink">
          {t('home.promise.title', 'Applying is free. Nobody should charge you.')}
        </h2>
        <p className="mt-3 text-ink-2 max-w-xl">{t('home.promise.body')}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <ListenButton text={`${t('home.promise.title')} ${t('home.promise.body')}`} />
          <LinkButton to="/tracker?report=fee" variant="secondary" size="sm" iconStart={<Warning size={18} />}>
            {t('home.promise.report', 'Someone asked me for money')}
          </LinkButton>
        </div>
      </div>
      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-surface p-5 shadow-hair">
          <dt className="text-small text-ink-2">{t('home.promise.fee', 'Government fee')}</dt>
          <dd className="mt-1 text-[2.5rem] leading-none font-semibold num-display text-patti">₹0</dd>
        </div>
        <div className="rounded-lg bg-surface p-5 shadow-hair">
          <dt className="text-small text-ink-2">{t('home.promise.cap', 'Most a CSC can charge')}</dt>
          <dd className="mt-1 text-[2.5rem] leading-none font-semibold num-display">₹30</dd>
        </div>
      </dl>
    </section>
  );
}

function CentreTeaser() {
  const { t } = useTranslation();
  return (
    <Link to="/help-centres" className="group flex items-center gap-4 rounded-lg bg-surface shadow-hair p-5 hover:shadow-lift transition-shadow">
      <span className="w-12 h-12 rounded-md bg-ghar-tint text-ghar grid place-items-center shrink-0">
        <MapPin size={26} weight="duotone" />
      </span>
      <span className="flex-1 min-w-0">
        <span className="block text-small text-ink-3">{t('home.centre.title', 'Help centre near you')}</span>
        <span className="block font-semibold truncate">{t('home.centre.name', 'Mandya Gram One Centre')}</span>
        <span className="block text-small text-ink-2">{t('home.centre.meta', '1.2 km · Open till 6 pm')}</span>
      </span>
      <ArrowRight size={20} className="text-ink-3 flip-rtl transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/* ── Screen ───────────────────────────────────────────────────────────────── */
export const HomeScreen: React.FC = () => {
  const { t, language } = useTranslation();
  const { isAudioAssistanceEnabled, profiles, activeProfileId } = useAppStore();
  const profile = profiles.find((p) => p.id === activeProfileId) ?? profiles[0];
  useWelcomeVoice(language, isAudioAssistanceEnabled);
  const firstName = displayName(profile).split(' ')[0];

  return (
    <div className="space-y-10 lg:space-y-14">
      <motion.div variants={staggerParent(0.07)} initial="hidden" animate="show" className="space-y-5 lg:space-y-6">
        <motion.header variants={riseIn} className="pt-2 lg:pt-4">
          <p className="text-ink-2 font-medium">
            {t(greetingKey())}, {firstName}
          </p>
          <h1 className="mt-1 text-h1 font-semibold max-w-3xl"><SplitText text={t('home.headline', 'What do you need help with today?')} delay={0.1} /></h1>
        </motion.header>

        <VoiceHero />
        <TrustStrip />
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.65fr_1fr] gap-5 lg:gap-6 items-stretch">
        <EntitlementBand />
        <NextStep />
      </div>

      <div className="grid lg:grid-cols-[1.65fr_1fr] gap-10 lg:gap-6 items-start">
        <LifeNeeds />
        <div className="space-y-4 lg:pt-[4.5rem]">
          <DeadlineCard />
          <CentreTeaser />
        </div>
      </div>

      <Picks />
      <BuiltFor />
      <InProgress />
      <Promise />
    </div>
  );
};

export default HomeScreen;
