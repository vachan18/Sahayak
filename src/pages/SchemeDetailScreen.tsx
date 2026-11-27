import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowSquareOut,
  BookmarkSimple,
  CheckCircle,
  Clock,
  Files,
  Phone,
  SealCheck,
  ShareNetwork,
  ShieldCheck,
  Warning,
  XCircle,
  Buildings,
  ListChecks,
  PaperPlaneRight,
  Path,
  MagnifyingGlass,
} from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { useScheme, benefitHeadline, cscCap, isEngineChecked, isStateScheme, schemeSpokenSummary } from '../components/schemes/catalog';
import { useSchemeActions } from '../components/schemes/SchemeCard';
import { shareText } from '../lib/share';
import { LifeGlyph, lifeEventOf, ListenButton, LinkButton, Button, Tag, Surface, Disclosure, EmptyState, AnimatedNumber, toneText, cx, riseIn, staggerParent, Reveal, RevealItem, Photo, LIFE_EVENT_PHOTO } from '../ui';

function Section({ id, title, icon, children, className }: { id: string; title: React.ReactNode; icon: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <motion.section variants={riseIn} aria-labelledby={id} className={cx('scroll-mt-24', className)}>
      <h2 id={id} className="flex items-center gap-2.5 text-h3 font-semibold mb-4">
        <span className="text-ink-3">{icon}</span>
        {title}
      </h2>
      {children}
    </motion.section>
  );
}

export const SchemeDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { addRecentlyViewedScheme, pushToast } = useAppStore();
  const scheme = useScheme(id);

  useEffect(() => {
    if (scheme) addRecentlyViewedScheme(scheme.id);
  }, [scheme, addRecentlyViewedScheme]);

  if (!scheme) {
    return (
      <div className="pt-10">
        <EmptyState
          icon={<MagnifyingGlass size={30} weight="duotone" />}
          title={t('schemes.detail.notFound', 'We could not find this scheme')}
          body={t('schemes.detail.notFoundBody')}
          action={
            <LinkButton to="/schemes" variant="solid">
              {t('schemes.detail.back', 'All schemes')}
            </LinkButton>
          }
        />
      </div>
    );
  }

  return <SchemeDetail key={scheme.id} schemeId={scheme.id} onShared={(msg) => pushToast({ message: msg, tone: 'success' })} />;
};

function SchemeDetail({ schemeId, onShared }: { schemeId: string; onShared: (msg: string) => void }) {
  const { t } = useTranslation();
  const scheme = useScheme(schemeId)!;
  const life = lifeEventOf(scheme.lifeEventId);
  const head = benefitHeadline(scheme, t);
  const KindIcon = head.kindIcon;
  const { isSaved, toggleSave } = useSchemeActions(scheme);
  const title = t(scheme.titleKey, scheme.titleKey);
  const verified = isEngineChecked(scheme);
  const guaranteed = scheme.processingTimeline?.isStatutoryGuarantee ?? false;
  const helplines = scheme.helplinePhone
    .split('/')
    .map((p) => p.trim())
    .filter(Boolean);

  const share = async () => {
    const res = await shareText({
      title,
      text: `${t('schemes.detail.shareText', 'I found this on Sahayak — free help with government schemes:')}\n${title} — ${head.prefix ? `${head.prefix} ` : ''}₹${scheme.financialBenefit.amount.toLocaleString('en-IN')} ${head.unit}`,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    });
    if (res === 'copied') onShared(t('schemes.detail.shared', 'Copied — paste it in WhatsApp to share'));
  };

  const steps = [
    { icon: ListChecks, title: t('schemes.detail.step1', 'Check that you qualify'), body: t('schemes.detail.step1Body'), to: `/eligibility?scheme=${scheme.id}` },
    { icon: Files, title: t('schemes.detail.step2', 'Get your papers ready'), body: t('schemes.detail.step2Body'), to: `/documents?scheme=${scheme.id}` },
    { icon: PaperPlaneRight, title: t('schemes.detail.step3', 'Apply on your own, or at a help centre'), body: t('schemes.detail.step3Body'), to: `/guidance/${scheme.id}` },
    { icon: Path, title: t('schemes.detail.step4', 'Track until the money arrives'), body: t('schemes.detail.step4Body'), to: '/tracker' },
  ];

  const actions = (stacked: boolean) => (
    <>
      <LinkButton to={`/eligibility?scheme=${scheme.id}`} variant="secondary" block={stacked} className={stacked ? '' : 'flex-1 min-w-0'}>
        {t('schemes.detail.checkCta', 'Check if I qualify')}
      </LinkButton>
      <LinkButton to={`/guidance/${scheme.id}`} block={stacked} className={stacked ? '' : 'flex-1 min-w-0'} iconEnd={<ArrowRight size={20} weight="bold" className="flip-rtl" />}>
        {t('schemes.detail.applyCta', 'Apply')}
      </LinkButton>
    </>
  );

  return (
    <div className="pb-28 lg:pb-0">
      {/* Crumb — desktop only; phones have Back in the top bar */}
      <nav aria-label="Breadcrumb" className="hidden lg:flex items-center gap-2 pt-2 text-small text-ink-3">
        <Link to="/schemes" className="inline-flex items-center gap-1.5 hover:text-ink">
          <ArrowLeft size={16} className="flip-rtl" />
          {t('schemes.detail.back', 'All schemes')}
        </Link>
        <span aria-hidden>/</span>
        <Link to={`/schemes?category=${scheme.lifeEventId}`} className="hover:text-ink">
          {t(life.titleKey)}
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-x-12 items-start">
        <div className="min-w-0">
          {/* Hero */}
          <motion.header variants={staggerParent(0.06)} initial="hidden" animate="show" className="pt-3 lg:pt-6 pb-8">
            <motion.div variants={riseIn} className="mb-6">
              <Photo id={LIFE_EVENT_PHOTO[scheme.lifeEventId]} priority parallax sizes="(min-width: 1024px) 60vw, 100vw" className="w-full aspect-[16/9] sm:aspect-[21/8]" />
            </motion.div>
            <motion.div variants={riseIn} className="flex items-center gap-3">
              <motion.span layoutId={`glyph-${scheme.id}`}>
                <LifeGlyph id={scheme.lifeEventId} size="lg" />
              </motion.span>
              <div className="min-w-0">
                <p className={cx('text-small font-semibold', toneText[life.tone])}>{t(life.titleKey)}</p>
                <p className="text-small text-ink-3 truncate">{t(scheme.ministryKey, scheme.ministryKey)}</p>
              </div>
            </motion.div>

            <motion.h1 variants={riseIn} className="mt-5 text-h1 font-semibold max-w-3xl">
              {title}
            </motion.h1>

            <motion.div variants={riseIn} className="mt-3 flex flex-wrap gap-2">
              {verified ? (
                <Tag tone="patti" icon={<SealCheck size={15} weight="fill" />}>
                  {t('schemes.detail.checked', 'Checked against official rules')}
                </Tag>
              ) : (
                <Tag tone="kesar" icon={<Warning size={15} weight="fill" />}>
                  {t('schemes.detail.reviewing', 'Rules being reviewed — confirm at the office')}
                </Tag>
              )}
              {isStateScheme(scheme) && <Tag tone="neel">{scheme.eligibilityCriteria.stateSpecific?.join(', ')}</Tag>}
            </motion.div>

            <motion.div variants={riseIn} layoutId={`amount-${scheme.id}`} className="mt-7">
              {head.prefix && <p className="text-ink-2">{head.prefix}</p>}
              <p className="text-display font-semibold num-display">
                <AnimatedNumber value={head.amount} />
              </p>
              <p className="mt-2 flex items-center gap-2 text-lead text-ink-2">
                <KindIcon size={22} weight="duotone" className="text-ink-3 shrink-0" />
                {head.unit}
              </p>
            </motion.div>

            <motion.div variants={riseIn} className="mt-6 flex flex-wrap items-center gap-2">
              <ListenButton text={schemeSpokenSummary(scheme, t)} />
              <Button variant="secondary" size="sm" className="rounded-full" iconStart={<ShareNetwork size={18} />} onClick={share}>
                {t('schemes.detail.share', 'Share')}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className={cx('rounded-full', isSaved && '!bg-haldi-tint !text-haldi-deep')}
                iconStart={<BookmarkSimple size={18} weight={isSaved ? 'fill' : 'regular'} />}
                onClick={() => toggleSave()}
                aria-pressed={isSaved}
              >
                {isSaved ? t('schemes.card.saved', 'Saved') : t('navSave', 'Save')}
              </Button>
            </motion.div>
          </motion.header>

          {/* Main column */}
          <motion.div variants={staggerParent(0.08, 0.15)} initial="hidden" animate="show" className="space-y-12 min-w-0">
            <Section id="about" title={t('schemes.detail.description', 'About this scheme')} icon={<Buildings size={22} weight="duotone" />}>
              <p className="text-ink-2 max-w-2xl">{t(scheme.fullDescKey, scheme.fullDescKey)}</p>
            </Section>

            <Section id="get" title={t('schemes.detail.whatYouGet', 'What you get')} icon={<KindIcon size={22} weight="duotone" />}>
              <ul className="grid grid-cols-1 gap-3">
                {scheme.keyBenefitsListKeys.map((k) => (
                  <li key={k} className="flex gap-3 p-4 rounded-md bg-surface shadow-hair">
                    <CheckCircle size={22} weight="fill" className="text-patti shrink-0 mt-0.5" />
                    <span className="min-w-0">{t(k, k)}</span>
                  </li>
                ))}
              </ul>
            </Section>

            <Section id="who" title={t('schemes.detail.whoCan', 'Who can get this')} icon={<CheckCircle size={22} weight="duotone" />}>
              <ul className="space-y-3">
                {scheme.whoIsEligibleListKeys.map((k) => (
                  <li key={k} className="flex gap-3">
                    <span className="w-7 h-7 shrink-0 rounded-full bg-patti-tint text-patti grid place-items-center mt-0.5">
                      <CheckCircle size={18} weight="bold" />
                    </span>
                    <span className="min-w-0">{t(k, k)}</span>
                  </li>
                ))}
              </ul>
              <Disclosure
                className="mt-5"
                summary={
                  <span className="flex items-center gap-2">
                    <XCircle size={20} weight="duotone" className="text-sindoor" />
                    {t('schemes.detail.whoCannot', 'Who is not covered')}
                  </span>
                }
              >
                <ul className="space-y-2.5">
                  {scheme.whoIsNotEligibleListKeys.map((k) => (
                    <li key={k} className="flex gap-2.5">
                      <XCircle size={18} className="text-sindoor shrink-0 mt-1" />
                      <span className="min-w-0">{t(k, k)}</span>
                    </li>
                  ))}
                </ul>
              </Disclosure>
            </Section>

            <Section id="papers" title={t('schemes.detail.papers', 'Papers you need')} icon={<Files size={22} weight="duotone" />}>
              <Reveal as="ul" className="rounded-lg bg-surface shadow-hair divide-y divide-line">
                {scheme.documents.map((d, i) => (
                  <RevealItem as="li" key={d.id} className="flex gap-4 p-4">
                    <span className="num w-8 h-8 shrink-0 rounded-full bg-sunken grid place-items-center text-small font-semibold">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">{t(d.nameKey, d.nameKey)}</p>
                      <p className="text-small text-ink-2 mt-0.5">{t(d.descriptionKey, d.descriptionKey)}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Tag tone={d.isMandatory ? 'neutral' : 'neel'} dot={false}>
                          {d.isMandatory ? t('schemes.detail.required', 'Required') : t('schemes.detail.optional', 'If applicable')}
                        </Tag>
                        {d.digiLockerSupported && (
                          <Tag tone="patti" icon={<SealCheck size={14} weight="fill" />}>
                            {t('schemes.detail.digilocker', 'Available in DigiLocker')}
                          </Tag>
                        )}
                      </div>
                    </div>
                  </RevealItem>
                ))}
              </Reveal>
              <LinkButton to={`/documents?scheme=${scheme.id}`} variant="quiet" className="mt-3 -ms-3" iconEnd={<ArrowRight size={18} weight="bold" className="flip-rtl" />}>
                {t('schemes.detail.papersCta', 'Get your papers ready')}
              </LinkButton>
            </Section>

            <Section id="how" title={t('schemes.detail.howTo', 'How to apply')} icon={<Path size={22} weight="duotone" />}>
              <ol className="relative">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <li key={s.title} className="relative flex gap-4 pb-6 last:pb-0">
                      {i < steps.length - 1 && <span className="absolute start-[19px] top-11 bottom-1 w-0.5 bg-line" aria-hidden />}
                      <span className="relative z-10 w-10 h-10 shrink-0 rounded-full bg-neel-tint text-neel-ink grid place-items-center">
                        <Icon size={20} weight="duotone" />
                      </span>
                      <Link to={s.to} className="group min-w-0 flex-1 pt-1.5">
                        <p className="font-semibold group-hover:underline underline-offset-4">
                          <span className="num text-ink-3 me-1.5">{i + 1}.</span>
                          {s.title}
                        </p>
                        <p className="text-small text-ink-2 mt-0.5">{s.body}</p>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </Section>

            <Section id="source" title={t('schemes.detail.source', 'Where this comes from')} icon={<SealCheck size={22} weight="duotone" />}>
              <Surface padded="sm" className="space-y-3">
                <p className="text-small text-ink-2">{scheme.sourceAttribution}</p>
                <p className="text-small text-ink-3">
                  {t('schemes.detail.lastChecked', 'Last checked')}: <span className="text-ink-2">{scheme.lastVerifiedDate}</span>
                </p>
                <a
                  href={scheme.officialPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 h-10 font-semibold text-neel-ink hover:underline underline-offset-4"
                >
                  {t('schemes.detail.officialSite', 'Official website')}
                  <ArrowSquareOut size={18} />
                </a>
              </Surface>
              {scheme.rulesRegistry && scheme.rulesRegistry.length > 0 && (
                <Disclosure className="mt-3" summary={t('schemes.detail.rules', 'Rules we checked')}>
                  <ul className="space-y-4">
                    {scheme.rulesRegistry.map((r) => (
                      <li key={r.ruleId} className="text-small">
                        <p className="text-ink">{r.ruleDescription}</p>
                        <p className="mt-1 text-ink-3">
                          {r.officialDocumentTitle}
                          {r.applicableClauseOrSection ? ` · ${r.applicableClauseOrSection}` : ''}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Disclosure>
              )}
            </Section>
          </motion.div>
        </div>

        {/* Summary aside — sticky on desktop, inline on phones */}
        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.32, ease: [0.2, 0, 0, 1] } }}
          aria-label={t('schemes.detail.summary', 'At a glance')}
          className="lg:sticky lg:top-[calc(var(--topbar-h)+24px)] lg:mt-6 mt-12 space-y-4 min-w-0"
        >
          <div className="rounded-lg bg-surface shadow-lift p-5">
            <h2 className="text-small font-semibold text-ink-3">{t('schemes.detail.feesTitle', 'Fees and time')}</h2>
            <dl className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-md bg-patti-tint p-3">
                <dt className="text-micro text-ink-2">{t('schemes.detail.govFee', 'Government fee')}</dt>
                <dd className="text-h2 font-semibold num-display text-patti">₹0</dd>
              </div>
              <div className="rounded-md bg-sunken p-3">
                <dt className="text-micro text-ink-2">{t('schemes.detail.cscCap', 'Most a CSC can charge')}</dt>
                <dd className="text-h2 font-semibold num-display">₹{cscCap(scheme)}</dd>
              </div>
            </dl>
            <div className="mt-4 flex items-start gap-3">
              <Clock size={22} weight="duotone" className="text-ink-3 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-small text-ink-3">{t('schemes.detail.timeLimit', 'Time to decide')}</p>
                <p className="font-semibold">
                  <span className="num">{scheme.processingSlaDays}</span> {t('schemes.detail.days', 'days')}
                </p>
                <p className="text-micro text-ink-3">
                  {guaranteed ? t('schemes.detail.guaranteed', 'Guaranteed by the Citizen Charter') : t('schemes.detail.estimate', 'Usual time, not a legal guarantee')}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <Buildings size={22} weight="duotone" className="text-ink-3 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="text-small text-ink-3">{t('schemes.detail.handledBy', 'Handled by')}</p>
                <p className="font-semibold">{t(scheme.handlingAuthorityKey, scheme.handlingAuthorityKey)}</p>
              </div>
            </div>
            <div className="hidden lg:flex flex-col gap-2 mt-5">{actions(true)}</div>
          </div>

          <div className="rounded-lg bg-surface shadow-hair p-5">
            <p className="flex items-center gap-2 text-small text-ink-3">
              <ShieldCheck size={18} weight="duotone" className="text-patti" />
              {t('schemes.detail.helpline', 'Free helpline')}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {helplines.map((p) => (
                <a key={p} href={`tel:${p.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-2 h-11 px-4 rounded-full bg-neel-tint text-neel-ink font-semibold num hover:brightness-95">
                  <Phone size={18} weight="fill" />
                  <span className="sr-only">{t('schemes.detail.call', 'Call')}</span>
                  {p}
                </a>
              ))}
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Phone action bar — sits just above the dock, in the thumb zone */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0, transition: { delay: 0.3, type: 'spring', stiffness: 300, damping: 32 } }}
        className="lg:hidden fixed inset-x-0 z-30 bottom-[calc(var(--dock-h)+var(--safe-b))] px-4 pt-3 pb-3 bg-surface/95 backdrop-blur-xl border-t border-line no-print"
      >
        <div className="flex gap-2 max-w-lg mx-auto">{actions(false)}</div>
      </motion.div>
    </div>
  );
}

export default SchemeDetailScreen;
