import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Storefront,
  DeviceMobile,
  Check,
  ArrowRight,
  ArrowSquareOut,
  Clock,
  CurrencyInr,
  Files,
  MapPin,
  Phone,
} from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { PageHeader, Tag, Button, ListenButton, LifeGlyph, ProgressBar, cx, spring, ease, dur } from '../ui';
import { StatutoryFeeBadge } from '../components/feedback/StatutoryFeeBadge';
import { haptic } from '../lib/haptics';

type PathId = 'csc' | 'online';

interface Step {
  key: string;
  title: string;
  bodyKey: string;
  body: string;
  link?: { to: string; external?: boolean; labelKey: string; label: string };
}

export const ApplicationGuidanceScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { schemes, addApplication, documentUploadStatus } = useAppStore();
  const scheme = schemes.find((s) => s.id === id) || schemes[0];
  const [path, setPath] = useState<PathId>('csc');
  const [done, setDone] = useState<Record<PathId, string[]>>({ csc: [], online: [] });
  const [submitting, setSubmitting] = useState(false);

  const papersReady = scheme.documents.filter((d) => {
    const s = documentUploadStatus[d.id] ?? d.status;
    return s === 'verified' || s === 'uploaded';
  }).length;

  const steps: Record<PathId, Step[]> = useMemo(
    () => ({
      csc: [
        { key: 'papers', title: 'Get your papers ready', bodyKey: 'documents.guidance.csc.papers', body: 'Check every paper on your phone first, so nothing is missing at the counter.', link: { to: `/documents?scheme=${scheme.id}`, labelKey: 'documents.guidance.openPapers', label: 'Open my papers' } },
        { key: 'slip', title: 'Make your centre slip', bodyKey: 'documents.guidance.csc.slip', body: 'Sahayak makes a slip with a QR code. The operator scans it and your details are filled in for you.' },
        { key: 'visit', title: 'Visit a help centre', bodyKey: 'documents.guidance.csc.visit', body: 'Any Common Service Centre, Gram One or Seva Kendra. Carry the original papers too.', link: { to: '/help-centres', labelKey: 'documents.guidance.findCentre', label: 'Find a centre near me' } },
        { key: 'pay', title: 'Pay at most ₹30 and take a receipt', bodyKey: 'documents.guidance.csc.pay', body: 'The government fee is ₹0. If you are asked for more, do not pay — you can report it.' },
        { key: 'track', title: 'Keep the acknowledgement number', bodyKey: 'documents.guidance.csc.track', body: 'Sahayak will follow your application and tell you when each step is done.' },
      ],
      online: [
        { key: 'papers', title: 'Get your papers ready', bodyKey: 'documents.guidance.online.papers', body: 'You will upload photos or PDFs. Check them here first so they are not rejected.', link: { to: `/documents?scheme=${scheme.id}`, labelKey: 'documents.guidance.openPapers', label: 'Open my papers' } },
        { key: 'portal', title: 'Open the official website', bodyKey: 'documents.guidance.online.portal', body: 'Only use the government website below. Never pay a website or app to apply.', link: { to: scheme.officialPortalUrl, external: true, labelKey: 'documents.guidance.openPortal', label: 'Open official website' } },
        { key: 'otp', title: 'Verify with Aadhaar OTP', bodyKey: 'documents.guidance.online.otp', body: 'A code is sent to the mobile number linked with your Aadhaar. Keep that phone with you.' },
        { key: 'upload', title: 'Fill the form and upload papers', bodyKey: 'documents.guidance.online.upload', body: 'Type your name exactly as it is written on your Aadhaar card.' },
        { key: 'save', title: 'Save the acknowledgement number', bodyKey: 'documents.guidance.online.save', body: 'Take a screenshot. Then tell Sahayak you applied, and we will track it for you.' },
      ],
    }),
    [scheme.id, scheme.officialPortalUrl]
  );

  const current = steps[path];
  const doneHere = done[path];
  const progress = (doneHere.length / current.length) * 100;

  const toggleStep = (key: string) => {
    haptic('select');
    setDone((d) => ({ ...d, [path]: d[path].includes(key) ? d[path].filter((k) => k !== key) : [...d[path], key] }));
  };

  const proceed = () => {
    setSubmitting(true);
    const token = `KA-${scheme.id.toUpperCase()}-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setTimeout(() => {
      setSubmitting(false);
      addApplication({
        id: `app-${Date.now()}`,
        tokenNumber: token,
        schemeId: scheme.id,
        schemeTitle: scheme.titleKey,
        submittedAt: 'Today, Just now',
        currentStage: 1,
        statusBadge: 'submitted',
        isDelayed: false,
        slaDeadlineDays: scheme.processingSlaDays,
        slaDaysRemaining: scheme.processingSlaDays,
        submittedVia: path === 'online' ? 'self_online' : 'csc_assisted',
        handlingOffice: scheme.handlingAuthorityKey,
        audioStatusNarrationKey: `Your application ${token} has been successfully acknowledged by the authority.`,
        milestones: [
          { stage: 1, titleKey: 'Application Submitted & Acknowledged', date: 'Today, Just now', isCompleted: true, isCurrent: true },
          { stage: 2, titleKey: 'Revenue & Land Record Verification', date: 'Upcoming (In 2 days)', isCompleted: false, isCurrent: false, handlingOfficer: scheme.handlingAuthorityKey },
          { stage: 3, titleKey: 'Sanction Order Issuance', date: `Upcoming (Within ${scheme.processingSlaDays} days)`, isCompleted: false, isCurrent: false },
          { stage: 4, titleKey: 'Direct Benefit Transfer (DBT Credit)', date: 'Upcoming Disbursal Cycle', isCompleted: false, isCurrent: false },
        ],
      });
      haptic('success');
      navigate(path === 'csc' ? `/csc-slip/${token}?scheme=${scheme.id}` : '/tracker');
    }, 900);
  };

  const options: { id: PathId; icon: typeof Storefront; titleKey: string; title: string; bodyKey: string; body: string; time: string; cost: string; recommended?: boolean }[] = [
    {
      id: 'csc',
      icon: Storefront,
      titleKey: 'documents.guidance.cscTitle',
      title: 'Get help at a centre',
      bodyKey: 'documents.guidance.cscBody',
      body: 'A trained operator fills the form with you. Best if this is your first time.',
      time: t('documents.guidance.cscTime', 'About 30 minutes'),
      cost: t('documents.guidance.cscCost', 'At most ₹30'),
      recommended: true,
    },
    {
      id: 'online',
      icon: DeviceMobile,
      titleKey: 'documents.guidance.onlineTitle',
      title: 'Apply myself online',
      bodyKey: 'documents.guidance.onlineBody',
      body: 'Use the official website with an Aadhaar OTP. Needs the phone linked to your Aadhaar.',
      time: t('documents.guidance.onlineTime', 'About 20 minutes'),
      cost: t('documents.guidance.onlineCost', 'Free'),
    },
  ];

  const spokenSteps = current.map((s, i) => `${i + 1}. ${t(`documents.guidance.step.${s.key}`, s.title)}. ${t(s.bodyKey, s.body)}`).join(' ');

  return (
    <div className="pb-8 max-w-4xl">
      <PageHeader
        eyebrow={
          <span className="inline-flex items-center gap-2.5">
            <LifeGlyph id={scheme.lifeEventId} size="sm" />
            {t(scheme.titleKey, scheme.titleKey).split('(')[0].trim()}
          </span>
        }
        title={t('documents.guidance.title', 'How do you want to apply?')}
        description={t('documents.guidance.subtitle', 'Both ways reach the same government office. Choose what is easier for you.')}
      />

      {/* Path choice */}
      <div role="radiogroup" aria-label={t('documents.guidance.title', 'How do you want to apply?')} className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {options.map((o) => {
          const selected = path === o.id;
          const Icon = o.icon;
          return (
            <motion.button
              key={o.id}
              type="button"
              role="radio"
              aria-checked={selected}
              whileTap={{ scale: 0.985 }}
              onClick={() => {
                haptic('select');
                setPath(o.id);
              }}
              className={cx(
                'relative text-start rounded-lg p-5 md:p-6 bg-surface transition-shadow duration-short min-w-0',
                selected ? 'shadow-[0_0_0_2px_rgb(var(--c-neel)),0_10px_28px_-14px_rgb(var(--c-shadow)/0.28)]' : 'shadow-hair hover:shadow-lift'
              )}
            >
              <div className="flex items-start gap-4">
                <span className={cx('w-12 h-12 rounded-md grid place-items-center shrink-0 transition-colors', selected ? 'bg-neel text-on-neel' : 'bg-sunken text-ink-2')}>
                  <Icon size={26} weight="duotone" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-h3 font-semibold">{t(o.titleKey, o.title)}</span>
                    {o.recommended && <Tag tone="patti">{t('documents.guidance.recommended', 'Recommended')}</Tag>}
                  </span>
                  <span className="block mt-1.5 text-ink-2">{t(o.bodyKey, o.body)}</span>
                </span>
                <span className={cx('w-6 h-6 rounded-full shrink-0 grid place-items-center transition-colors', selected ? 'bg-neel' : 'shadow-[inset_0_0_0_2px_rgb(var(--c-line-strong))]')}>
                  {selected && <motion.span layoutId="path-dot" className="w-2.5 h-2.5 rounded-full bg-on-neel" transition={spring.snappy} />}
                </span>
              </div>
              <span className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-small text-ink-2">
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={16} /> {o.time}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CurrencyInr size={16} /> {o.cost}
                </span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <StatutoryFeeBadge className="mt-5" />

      {/* Steps */}
      <section aria-labelledby="steps-title" className="mt-10">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-2">
          <h2 id="steps-title" className="text-h2 font-semibold">
            {t('documents.guidance.stepsTitle', 'Step by step')}
          </h2>
          <ListenButton text={spokenSteps} />
        </div>
        <div className="flex items-center gap-3 mb-6">
          <ProgressBar value={progress} tone="patti" label={t('documents.guidance.stepsTitle', 'Step by step')} className="flex-1 max-w-xs" />
          <span className="text-small text-ink-2 num">
            {doneHere.length}/{current.length}
          </span>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.ol
            key={path}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0, transition: { duration: dur.medium, ease: ease.out } }}
            exit={{ opacity: 0, transition: { duration: dur.micro } }}
            className="relative"
          >
            {current.map((s, i) => {
              const checked = doneHere.includes(s.key);
              const last = i === current.length - 1;
              return (
                <li key={s.key} className="relative flex gap-4 pb-6">
                  {!last && <span aria-hidden className={cx('absolute top-12 bottom-1 start-[23px] w-0.5 rounded-full transition-colors duration-medium', checked ? 'bg-patti' : 'bg-line')} />}
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={`${t('documents.guidance.markDone', 'Mark as done')}: ${t(`documents.guidance.step.${s.key}`, s.title)}`}
                    onClick={() => toggleStep(s.key)}
                    className={cx(
                      'relative z-[1] w-12 h-12 rounded-full grid place-items-center shrink-0 font-semibold num transition-colors duration-short',
                      checked ? 'bg-patti text-white' : 'bg-surface text-ink shadow-hair hover:shadow-lift'
                    )}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span key={checked ? 'c' : 'n'} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.4, opacity: 0 }} transition={spring.snappy}>
                        {checked ? <Check size={22} weight="bold" /> : i + 1}
                      </motion.span>
                    </AnimatePresence>
                  </button>
                  <div className="flex-1 min-w-0 pt-2.5">
                    <h3 className={cx('font-semibold transition-colors', checked && 'text-ink-3 line-through decoration-2 decoration-patti/60')}>{t(`documents.guidance.step.${s.key}`, s.title)}</h3>
                    <p className="mt-1 text-ink-2">{t(s.bodyKey, s.body)}</p>
                    {s.key === 'papers' && (
                      <p className="mt-2 inline-flex items-center gap-1.5 text-small font-medium text-ink-2">
                        <Files size={16} />
                        <span className="num">
                          {papersReady}/{scheme.documents.length}
                        </span>{' '}
                        {t('documents.readyLabel', 'ready')}
                      </p>
                    )}
                    {s.link &&
                      (s.link.external ? (
                        <a href={s.link.to} target="_blank" rel="noopener noreferrer" className="mt-2 flex w-fit items-center gap-1.5 h-10 text-small font-semibold text-neel-ink hover:underline underline-offset-4">
                          {t(s.link.labelKey, s.link.label)} <ArrowSquareOut size={16} weight="bold" />
                        </a>
                      ) : (
                        <Link to={s.link.to} className="mt-2 flex w-fit items-center gap-1.5 h-10 text-small font-semibold text-neel-ink hover:underline underline-offset-4">
                          {s.link.to === '/help-centres' ? <MapPin size={16} weight="bold" /> : null}
                          {t(s.link.labelKey, s.link.label)} <ArrowRight size={16} weight="bold" className="flip-rtl" />
                        </Link>
                      ))}
                  </div>
                </li>
              );
            })}
          </motion.ol>
        </AnimatePresence>

        <p className="flex items-center gap-2 text-small text-ink-2">
          <Phone size={18} />
          {t('documents.guidance.helpline', 'Helpline')}: <a href={`tel:${scheme.helplinePhone.split('/')[0].trim()}`} className="num font-semibold text-neel-ink">{scheme.helplinePhone}</a>
        </p>
      </section>

      {/* Primary action — sticks above the dock on phones */}
      <div className="sticky bottom-[calc(var(--dock-h)+var(--safe-b)+12px)] lg:bottom-6 mt-8 z-10">
        <div className="rounded-lg bg-surface shadow-float p-3 flex flex-col xs:flex-row xs:items-center gap-3">
          <p className="flex-1 min-w-0 px-2 text-small text-ink-2">
            {path === 'csc'
              ? t('documents.guidance.ctaHintCsc', 'Your slip has a QR code the operator can scan.')
              : t('documents.guidance.ctaHintOnline', 'Already applied? Add it here so we can track it.')}
          </p>
          <Button size="lg" loading={submitting} onClick={proceed} iconEnd={<ArrowRight size={20} weight="bold" className="flip-rtl" />}>
            {path === 'csc' ? t('documents.guidance.ctaCsc', 'Make my centre slip') : t('documents.guidance.ctaOnline', 'I have applied — track it')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationGuidanceScreen;
