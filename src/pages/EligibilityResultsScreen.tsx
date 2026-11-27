import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  WhatsappLogo,
  Printer,
  UserSwitch,
  ArrowCounterClockwise,
  FirstAidKit,
  Coins,
  Baby,
  GraduationCap,
  Info,
  PencilSimple,
  MapPin,
  ListChecks,
  Check,
} from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { assessEligibility } from '../services/eligibilityEngine';
import { saveAssessmentToDb } from '../services/assessmentDbService';
import { eligibilityQuestions } from '../data/questions';
import { shareText } from '../lib/share';
import { haptic } from '../lib/haptics';
import { Avatar, displayName } from '../components/shell/FamilySwitcher';
import { ResultRow, useAmountLabel } from '../components/eligibility/ResultRow';
import { SahayakLogo } from '../components/common/SahayakLogo';
import {
  AnimatedNumber,
  Button,
  LinkButton,
  ListenButton,
  Disclosure,
  EmptyState,
  Reveal,
  RevealItem,
  Sheet,
  Tag,
  LifeGlyph,
  formatINR,
  formatINRShort,
  cx,
  ease,
  riseIn,
  staggerParent,
} from '../ui';
import type { EligibilityQuestion } from '../types';

/** A check mark that draws itself — the one celebratory beat on this screen. */
function DrawnCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 52 52" className={className} aria-hidden>
      <motion.circle cx="26" cy="26" r="24" fill="none" stroke="currentColor" strokeWidth="2.5" pathLength={1} strokeDasharray="1 1" initial={{ strokeDashoffset: 1 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 0.6, ease: ease.out }} />
      <motion.path d="M15 27 l7.5 7.5 L37.5 19" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1 1" initial={{ strokeDashoffset: 1 }} animate={{ strokeDashoffset: 0 }} transition={{ duration: 0.4, delay: 0.45, ease: ease.out }} />
    </svg>
  );
}

function GroupHeader({ id, title, sub, count, tone }: { id: string; title: string; sub: string; count: number; tone: 'patti' | 'kesar' }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-4">
      <div className="min-w-0">
        <h2 id={id} className="text-h2 font-semibold">
          {title}
        </h2>
        <p className="mt-1 text-ink-2">{sub}</p>
      </div>
      <Tag tone={tone} className="mt-2">
        <span className="num">{count}</span>
      </Tag>
    </div>
  );
}

export const EligibilityResultsScreen: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    eligibilityAnswers,
    resetEligibilityAnswers,
    setEligibilityStatus,
    authUser,
    recordAssessment,
    activeProfileId,
    setActiveProfileId,
    profiles,
    pushToast,
  } = useAppStore();
  const [chooserOpen, setChooserOpen] = useState(false);
  const amountOf = useAmountLabel();

  const answers = eligibilityAnswers as Record<string, unknown>;
  const hasAnswers = Object.keys(answers).length > 0;
  const assessment = useMemo(() => assessEligibility(eligibilityAnswers), [eligibilityAnswers]);
  const profileIndex = Math.max(0, profiles.findIndex((p) => p.id === activeProfileId));
  const profile = profiles[profileIndex];
  const name = displayName(profile);

  // Persist the outcome once per unique set of answers (history + optional cloud save + journey state)
  const savedFingerprint = useRef<string | null>(null);
  useEffect(() => {
    if (!hasAnswers || assessment.status === 'not_assessed' || assessment.status === 'in_progress') return;
    setEligibilityStatus(assessment.status);
    const fingerprint = `${JSON.stringify(eligibilityAnswers)}-${assessment.status}-${activeProfileId}`;
    if (savedFingerprint.current === fingerprint) return;
    savedFingerprint.current = fingerprint;
    recordAssessment({
      id: `assess-${Date.now()}`,
      completedAt: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      profileId: activeProfileId,
      profileName: profile?.name || 'Self',
      status: assessment.status,
      eligibleCount: assessment.eligibleSchemes.length,
      totalAnnualBenefitValue: assessment.totalAnnualBenefitValue,
      answers: eligibilityAnswers,
    });
    if (authUser?.id) saveAssessmentToDb(authUser.id, eligibilityAnswers, assessment).catch(console.warn);
  }, [hasAnswers, assessment, eligibilityAnswers, activeProfileId, profile?.name, authUser?.id, recordAssessment, setEligibilityStatus]);

  const likely = assessment.eligibleSchemes;
  const verify = assessment.additionalVerificationSchemes;
  const notNow = assessment.notEstablishedSchemes;
  const b = assessment.categorizedBenefits;
  const cash = assessment.totalAnnualCashBenefit;
  const positive = likely.length > 0;

  // Separate, never-summed benefit tiles
  const tiles = [
    b.healthInsuranceCoverTotal > 0 && { icon: FirstAidKit, value: b.healthInsuranceCoverTotal, title: t('eligibility.results.healthCover', 'Free hospital treatment'), sub: t('eligibility.results.healthCoverSub') },
    b.loanCreditFacilityTotal > 0 && { icon: Coins, value: b.loanCreditFacilityTotal, title: t('eligibility.results.loan', 'Low-interest loan'), sub: t('eligibility.results.loanSub') },
    b.oneTimeCashTotal > 0 && { icon: Baby, value: b.oneTimeCashTotal, title: t('eligibility.results.oneTime', 'One-time help'), sub: t('eligibility.results.oneTimeSub') },
    b.scholarshipTotal > 0 && { icon: GraduationCap, value: b.scholarshipTotal, title: t('eligibility.results.scholarship', 'Study support'), sub: t('eligibility.results.scholarshipSub') },
  ].filter(Boolean) as { icon: typeof Coins; value: number; title: string; sub: string }[];

  const schemeCountWord = likely.length === 1 ? t('eligibility.results.schemeWord', 'scheme') : t('eligibility.results.schemesWord', 'schemes');

  const speech = positive
    ? `${t('eligibility.results.speechSummary')} ₹${formatINR(cash)}. ${likely.map((s) => t(s.titleKey, s.titleKey)).join(', ')}.`
    : `${t('eligibility.results.noneTitle')}. ${t('eligibility.results.noneBody')}`;

  const onShare = async () => {
    haptic('tap');
    const lines = [
      `${t('eligibility.results.shareIntro', 'Sahayak eligibility summary for')} ${name}`,
      positive ? `${t('eligibility.results.mayGet')} ${likely.length} ${schemeCountWord} · ₹${formatINR(cash)} ${t('eligibility.results.cashPerYear')}` : t('eligibility.results.noneTitle'),
      ...likely.map((s) => {
        const a = amountOf(s);
        return `• ${t(s.titleKey, s.titleKey)} — ${a.amount} ${a.unit}`;
      }),
      ...verify.map((o) => `• ${t(o.scheme.titleKey, o.scheme.titleKey)} — ${t('eligibility.group.verify')}`),
      '',
      t('eligibility.results.disclaimer'),
      t('eligibility.results.shareCta', 'Check what your family can get, free:'),
    ];
    const res = await shareText({ title: 'Sahayak', text: lines.join('\n'), url: `${window.location.origin}/eligibility` });
    if (res === 'copied') pushToast({ message: t('eligibility.results.copied', 'Summary copied — paste it anywhere'), tone: 'success' });
  };

  const startAgain = () => {
    resetEligibilityAnswers();
    navigate('/eligibility', { state: { step: 0 } });
  };

  const answeredQuestions = eligibilityQuestions.filter((q) => (!q.condition || q.condition(answers)) && answers[q.fieldName] !== undefined);
  const labelFor = (q: EligibilityQuestion) => {
    const o = q.options?.find((x) => x.value === answers[q.fieldName]);
    return o ? t(o.labelKey) : '';
  };

  if (!hasAnswers) {
    return (
      <div className="pt-8">
        <EmptyState
          icon={<ListChecks size={30} weight="duotone" />}
          title={t('eligibility.results.emptyTitle', 'You have not answered the questions yet')}
          body={t('eligibility.results.emptyBody')}
          action={<LinkButton to="/eligibility">{t('eligibility.results.emptyCta', 'Start the check')}</LinkButton>}
        />
      </div>
    );
  }

  return (
    <div className="pt-2 lg:pt-4 flex flex-col gap-10 lg:gap-12">
      {/* Print-only letterhead */}
      <div className="hidden print:flex items-center gap-3 border-b border-black pb-3">
        <SahayakLogo className="h-11 w-auto" />
        <div>
          <p className="font-semibold">Sahayak — {t('eligibility.results.eyebrow', 'Your results')}</p>
          <p className="text-small">
            {name} · {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      {/* ── Hero ─────────────────────────────────────────────── */}
      <motion.section
        variants={staggerParent(0.08)}
        initial="hidden"
        animate="show"
        aria-labelledby="results-title"
        className={cx('relative overflow-hidden rounded-xl print-sheet', positive ? 'bg-hero-patti text-on-hero' : 'bg-surface shadow-hair text-ink')}
      >
        <div className="relative p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-8 lg:gap-10">
          <div className="min-w-0">
            <motion.div variants={riseIn} className="flex items-center gap-3">
              <Avatar profile={profile} index={profileIndex} size={36} />
              <p className={cx('text-small font-semibold', positive ? 'text-on-hero/80' : 'text-ink-3')}>
                {t('eligibility.results.eyebrow', 'Your results')} · {name}
              </p>
            </motion.div>

            {positive ? (
              <>
                <motion.div variants={riseIn} className="mt-6 flex items-center gap-3">
                  <DrawnCheck className="w-11 h-11 text-haldi shrink-0" />
                  <h1 id="results-title" className="text-h2 font-semibold">
                    {t('eligibility.results.goodNews', 'Good news')} — {t('eligibility.results.mayGet', 'You may be able to get')} <span className="num">{likely.length}</span> {schemeCountWord}
                  </h1>
                </motion.div>
                <motion.p variants={riseIn} className="mt-6">
                  <AnimatedNumber value={cash} className="block text-display font-semibold num-display" duration={1.3} />
                  <span className="block mt-2 text-lead text-on-hero/85">{t('eligibility.results.cashPerYear', 'in cash every year, sent to your bank')}</span>
                </motion.p>
              </>
            ) : (
              <motion.div variants={riseIn} className="mt-6">
                <h1 id="results-title" className="text-h1 font-semibold">
                  {verify.length ? t('eligibility.results.verifyTitle', 'Almost there') : t('eligibility.results.noneTitle', 'No exact match yet')}
                </h1>
                <p className="mt-3 text-lead text-ink-2 max-w-xl">{verify.length ? t('eligibility.results.verifyBody') : t('eligibility.results.noneBody')}</p>
                {!verify.length && (
                  <LinkButton to="/help-centres" variant="secondary" className="mt-5" iconStart={<MapPin size={18} weight="duotone" />}>
                    {t('shell.nav.helpCentres', 'Help centres')}
                  </LinkButton>
                )}
              </motion.div>
            )}

            <motion.p variants={riseIn} className={cx('mt-6 flex gap-2 text-small max-w-lg', positive ? 'text-on-hero/75' : 'text-ink-3')}>
              <Info size={18} className="shrink-0 mt-0.5" />
              {t('eligibility.results.disclaimer')}
            </motion.p>
          </div>

          <motion.div variants={riseIn} className="min-w-0 flex flex-col gap-3 lg:justify-end">
            {tiles.length > 0 && (
              <>
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
                  {tiles.map((tile) => (
                    <div key={tile.title} className={cx('rounded-md p-4', positive ? 'bg-white/10' : 'bg-sunken')}>
                      <tile.icon size={24} weight="duotone" />
                      <p className="mt-2 text-h3 font-semibold num">₹{formatINRShort(tile.value)}</p>
                      <p className="font-semibold text-small">{tile.title}</p>
                      <p className={cx('text-micro', positive ? 'text-on-hero/75' : 'text-ink-3')}>{tile.sub}</p>
                    </div>
                  ))}
                </div>
                <p className={cx('text-micro', positive ? 'text-on-hero/70' : 'text-ink-3')}>{t('eligibility.results.notSummed')}</p>
              </>
            )}
            <div className="flex flex-wrap gap-2 no-print">
              <Button variant="primary" iconStart={<WhatsappLogo size={20} weight="fill" />} onClick={onShare}>
                {t('eligibility.results.share', 'Share on WhatsApp')}
              </Button>
              <ListenButton text={speech} label={t('eligibility.results.listen', 'Hear my results')} variant="pill" className={positive ? '!bg-white/15 !text-on-hero h-12' : 'h-12'} />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Likely ───────────────────────────────────────────── */}
      {likely.length > 0 && (
        <section aria-labelledby="g-likely">
          <GroupHeader id="g-likely" title={t('eligibility.group.likely', 'Likely for you')} sub={t('eligibility.group.likelySub')} count={likely.length} tone="patti" />
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {likely.map((s) => (
              <RevealItem key={s.id} className="min-w-0">
                <ResultRow scheme={s} outcome={assessment.evaluations[s.id]} kind="likely" />
              </RevealItem>
            ))}
          </Reveal>
        </section>
      )}

      {/* ── Needs one more check ─────────────────────────────── */}
      {verify.length > 0 && (
        <section aria-labelledby="g-verify">
          <GroupHeader id="g-verify" title={t('eligibility.group.verify', 'Need one more check')} sub={t('eligibility.group.verifySub')} count={verify.length} tone="kesar" />
          <Reveal className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {verify.map((o) => (
              <RevealItem key={o.scheme.id} className="min-w-0">
                <ResultRow scheme={o.scheme} outcome={o} kind="verify" />
              </RevealItem>
            ))}
          </Reveal>
        </section>
      )}

      {/* ── Not for now (collapsed) ──────────────────────────── */}
      {notNow.length > 0 && (
        <section aria-labelledby="g-notnow">
          <Disclosure
            summary={
              <span className="flex items-center gap-3">
                <span id="g-notnow" className="text-lead font-semibold">
                  {t('eligibility.group.notNow', 'Not for now')}
                </span>
                <Tag>
                  <span className="num">{notNow.length}</span>
                </Tag>
              </span>
            }
          >
            <p className="mb-4">{t('eligibility.group.notNowSub')}</p>
            <ul className="divide-y divide-line">
              {notNow.map((o) => (
                <li key={o.scheme.id} className="py-3 flex items-start gap-3">
                  <LifeGlyph id={o.scheme.lifeEventId} size="sm" className="opacity-70" />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-ink">{t(o.scheme.titleKey, o.scheme.titleKey)}</p>
                    <p className="text-small mt-0.5">
                      <span className="font-semibold">{t('eligibility.row.why', 'Why not')}: </span>
                      {(() => { const r = o.disqualifyingExclusions[0] || o.missingCriteria[0] || o.explanation; return t(r, r); })()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Disclosure>
        </section>
      )}

      {/* ── Answers recap + next actions ─────────────────────── */}
      <section aria-labelledby="recap" className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
        <div className="rounded-lg bg-surface shadow-hair p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="recap" className="text-h3 font-semibold">
              {t('eligibility.recap.title', 'Based on these answers')}
            </h2>
            <LinkButton to="/eligibility" state={{ step: 0 }} variant="quiet" size="sm" iconStart={<PencilSimple size={16} />} className="no-print">
              {t('eligibility.recap.change', 'Change answers')}
            </LinkButton>
          </div>
          <dl className="mt-3 divide-y divide-line">
            {answeredQuestions.map((q, i) => (
              <div key={q.id} className="py-3 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-1 sm:gap-4">
                <dt className="text-small text-ink-3">{t(q.textKey)}</dt>
                <dd className="text-small font-semibold flex items-start justify-between gap-2">
                  <span className="flex items-start gap-1.5">
                    <Check size={16} weight="bold" className="mt-0.5 text-patti shrink-0" />
                    {labelFor(q)}
                  </span>
                  <button type="button" onClick={() => navigate('/eligibility', { state: { step: i } })} className="no-print shrink-0 text-neel-ink text-micro font-semibold hover:underline underline-offset-4 min-h-[32px]">
                    {t('eligibility.checker.edit', 'Change')}
                  </button>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-lg bg-sunken p-5 sm:p-6 flex flex-col gap-2 self-start no-print">
          <Button variant="secondary" block iconStart={<UserSwitch size={20} weight="duotone" />} onClick={() => setChooserOpen(true)}>
            {t('eligibility.results.another', 'Check for another family member')}
          </Button>
          <Button variant="secondary" block iconStart={<Printer size={20} weight="duotone" />} onClick={() => window.print()}>
            {t('eligibility.results.print', 'Print or save as PDF')}
          </Button>
          <Button variant="ghost" block iconStart={<ArrowCounterClockwise size={20} />} onClick={startAgain}>
            {t('eligibility.results.startAgain', 'Start again')}
          </Button>
        </div>
      </section>

      <Sheet open={chooserOpen} onClose={() => setChooserOpen(false)} title={t('eligibility.results.anotherTitle', 'Who are you checking for?')} description={t('eligibility.results.anotherBody')} closeLabel={t('navClose', 'Close')} size="sm">
        <ul className="space-y-2 pt-1">
          {profiles.map((p, i) => {
            const isActive = p.id === activeProfileId;
            return (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => {
                    haptic('select');
                    setActiveProfileId(p.id);
                    resetEligibilityAnswers();
                    setChooserOpen(false);
                    navigate('/eligibility', { state: { step: 0 } });
                  }}
                  className={cx('w-full flex items-center gap-3 p-3 rounded-md text-start min-h-[64px] transition-shadow', isActive ? 'bg-neel-tint' : 'bg-surface shadow-hair hover:shadow-lift')}
                >
                  <Avatar profile={p} index={i} size={40} />
                  <span className="flex-1 min-w-0 font-semibold truncate">{displayName(p)}</span>
                  {isActive && <Check size={20} weight="bold" className="text-neel-ink" />}
                </button>
              </li>
            );
          })}
        </ul>
      </Sheet>
    </div>
  );
};

export default EligibilityResultsScreen;
