import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Storefront,
  Buildings,
  Bank,
  Envelope,
  Scroll,
  NavigationArrow,
  Phone,
  Clock,
  Translate,
  MapPin,
  CheckCircle,
  type Icon,
} from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { LANGUAGE_META } from '../data/languages';
import { helpCentres, HOME_LOCATION, openState, formatClock, mapsUrl, HelpCentre, CentreType, CentreService } from '../data/helpCentres';
import { PageHeader, Chip, Tag, EmptyState, toneTint, cx, spring, ease } from '../ui';
import { StatutoryFeeBadge } from '../components/feedback/StatutoryFeeBadge';

const TYPE_META: Record<CentreType, { icon: Icon; tone: 'neel' | 'kaarigar' | 'ghar' | 'sehat' | 'vidya'; key: string; fallback: string }> = {
  gram_one: { icon: Buildings, tone: 'neel', key: 'documents.centres.type.gramOne', fallback: 'Gram One centre' },
  csc: { icon: Storefront, tone: 'kaarigar', key: 'documents.centres.type.csc', fallback: 'Common Service Centre' },
  seva_kendra: { icon: Scroll, tone: 'vidya', key: 'documents.centres.type.seva', fallback: 'Revenue office (Nada Kacheri)' },
  post_office: { icon: Envelope, tone: 'sehat', key: 'documents.centres.type.post', fallback: 'Post office' },
  bank_mitra: { icon: Bank, tone: 'ghar', key: 'documents.centres.type.bank', fallback: 'Bank Mitra point' },
};

const SERVICE_LABEL: Record<CentreService, { key: string; fallback: string }> = {
  aadhaar: { key: 'documents.centres.svc.aadhaar', fallback: 'Aadhaar update' },
  land: { key: 'documents.centres.svc.land', fallback: 'Land records' },
  certificates: { key: 'documents.centres.svc.certificates', fallback: 'Income & caste certificates' },
  pmkisan: { key: 'documents.centres.svc.pmkisan', fallback: 'PM-KISAN' },
  pension: { key: 'documents.centres.svc.pension', fallback: 'Pensions' },
  bank: { key: 'documents.centres.svc.bank', fallback: 'Bank account' },
  health: { key: 'documents.centres.svc.health', fallback: 'Ayushman card' },
  scholarship: { key: 'documents.centres.svc.scholarship', fallback: 'Scholarships' },
  ration: { key: 'documents.centres.svc.ration', fallback: 'Ration card' },
};

const RINGS = [2, 10, 25];
const MAX_KM = 28;

/** Radial "distance map": you at the centre, true bearing, √distance radius so nearby centres don't pile up. */
function position(c: HelpCentre) {
  const dx = (c.lng - HOME_LOCATION.lng) * Math.cos((HOME_LOCATION.lat * Math.PI) / 180);
  const dy = c.lat - HOME_LOCATION.lat;
  const angle = Math.atan2(dy, dx);
  const r = (Math.sqrt(c.distanceKm) / Math.sqrt(MAX_KM)) * 46;
  return { x: 50 + r * Math.cos(angle), y: 50 - r * Math.sin(angle) };
}
const ringRadius = (km: number) => (Math.sqrt(km) / Math.sqrt(MAX_KM)) * 46;

function DistanceMap({ centres, activeId, onPick }: { centres: HelpCentre[]; activeId: string; onPick: (id: string) => void }) {
  const { t } = useTranslation();
  const active = centres.find((c) => c.id === activeId);
  return (
    <div className="relative rounded-xl bg-sunken overflow-hidden aspect-[16/11] lg:aspect-square" role="group" aria-label={t('documents.centres.mapLabel', 'Map of help centres around you')}>
      <div className="absolute inset-0 m-auto h-full aspect-square max-w-full">
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" aria-hidden direction="ltr">
          {/* bearing lines */}
          <path d="M50 2V98M2 50H98" className="stroke-line-strong" strokeWidth="0.25" strokeDasharray="0.8 1.6" />
          {RINGS.map((km) => (
            <g key={km}>
              <circle cx="50" cy="50" r={ringRadius(km)} fill="none" className="stroke-line-strong" strokeWidth="0.3" strokeDasharray="1 1.4" />
              <text direction="ltr" x={50 + ringRadius(km) * 0.72} y={50 - ringRadius(km) * 0.72} className="fill-ink-3" fontSize="2.6" fontWeight={600}>
                {km} km
              </text>
            </g>
          ))}
          <text x="50" y="5.5" textAnchor="middle" className="fill-ink-3" fontSize="3" fontWeight={700}>
            N
          </text>
          {active && (() => {
            const p = position(active);
            return <motion.line x1="50" y1="50" initial={false} animate={{ x2: p.x, y2: p.y }} transition={spring.gentle} className="stroke-neel" strokeWidth="0.5" strokeDasharray="1.2 1" />;
          })()}
        </svg>

        {/* you */}
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center" aria-hidden>
          <span className="absolute w-6 h-6 rounded-full bg-neel/25 animate-ring-out" />
          <span className="relative w-4 h-4 rounded-full bg-neel ring-4 ring-surface" />
        </span>
        <span className="absolute left-1/2 top-1/2 translate-y-3 -translate-x-1/2 text-micro font-semibold text-neel-ink">{t('documents.centres.you', 'You')}</span>

        {centres.map((c) => {
          const p = position(c);
          const meta = TYPE_META[c.type];
          const isActive = c.id === activeId;
          const PinIcon = meta.icon;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onPick(c.id)}
              aria-label={`${t(c.name, c.name)}, ${c.distanceKm} km`}
              aria-pressed={isActive}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-11 h-11 grid place-items-center"
              style={{ left: `${p.x}%`, top: `${p.y}%`, zIndex: isActive ? 3 : 2 }}
            >
              <motion.span
                animate={{ scale: isActive ? 1.15 : 1 }}
                transition={spring.snappy}
                className={cx('relative w-8 h-8 rounded-full grid place-items-center shadow-lift', isActive ? 'bg-ink text-paper' : cx('ring-2 ring-surface', toneTint[meta.tone]))}
              >
                {isActive && <span className="absolute inset-0 rounded-full bg-ink/30 animate-ring-out" aria-hidden />}
                <PinIcon size={16} weight="fill" className="relative" />
              </motion.span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.22, ease: ease.out }}
            className="absolute bottom-3 inset-x-3 rounded-md bg-surface/95 backdrop-blur shadow-lift px-4 py-2.5 flex items-center gap-3"
          >
            <MapPin size={20} weight="fill" className="text-neel shrink-0" />
            <span className="flex-1 min-w-0 text-small font-semibold truncate">{t(active.name, active.name)}</span>
            <span className="num text-small text-ink-2 shrink-0" dir="ltr">{active.distanceKm} km</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CentreCard({ c, active, onSelect, cardRef }: { c: HelpCentre; active: boolean; onSelect: () => void; cardRef: (el: HTMLLIElement | null) => void }) {
  const { t, language } = useTranslation();
  const meta = TYPE_META[c.type];
  const TypeIcon = meta.icon;
  const { open, closesSoon } = openState(c);

  return (
    <motion.li
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, ease: ease.out, layout: spring.gentle }}
      onClick={onSelect}
      className={cx(
        'min-w-0 rounded-lg bg-surface p-5 cursor-pointer transition-shadow duration-short',
        active ? 'shadow-[0_0_0_2px_rgb(var(--c-ink)),0_10px_28px_-14px_rgb(var(--c-shadow)/0.28)]' : 'shadow-hair hover:shadow-lift'
      )}
    >
      <div className="flex items-start gap-4">
        <span className={cx('w-12 h-12 rounded-md grid place-items-center shrink-0', toneTint[meta.tone])}>
          <TypeIcon size={26} weight="duotone" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold leading-snug">{t(c.name, c.name)}</h3>
          <p className="text-small text-ink-3">{t(meta.key, meta.fallback)}</p>
        </div>
        <p className="shrink-0 text-end">
          <span className="block text-h3 font-semibold num leading-none">{c.distanceKm}</span>
          <span className="text-micro text-ink-3">km</span>
        </p>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {open ? (
          <Tag tone={closesSoon ? 'kesar' : 'patti'}>
            {closesSoon ? t('documents.centres.closesSoon', 'Closes soon') : t('documents.centres.openNow', 'Open now')} · {t('documents.centres.until', 'till')} {formatClock(c.close, language)}
          </Tag>
        ) : (
          <Tag tone="neutral">
            {t('documents.centres.closed', 'Closed')} · {t('documents.centres.opensAt', 'opens')} {formatClock(c.open, language)}
          </Tag>
        )}
        <span className="inline-flex items-center gap-1.5 text-small text-ink-2">
          <Translate size={16} />
          <span className="truncate">{c.languages.map((l) => LANGUAGE_META[l]?.label ?? l).join(' · ')}</span>
        </span>
      </div>

      <p className="mt-3 text-small text-ink-2">{t(c.address, c.address)}</p>

      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t('documents.centres.services', 'Services')}>
        {c.services.map((s) => (
          <li key={s} className="h-7 px-2.5 rounded-full bg-sunken text-micro font-medium text-ink-2 grid place-items-center">
            {t(SERVICE_LABEL[s].key, SERVICE_LABEL[s].fallback)}
          </li>
        ))}
      </ul>

      <div className="mt-5 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
        <a
          href={mapsUrl(c)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 h-12 rounded-md bg-neel text-on-neel font-semibold hover:bg-neel-deep transition-colors"
        >
          <NavigationArrow size={20} weight="fill" className="flip-rtl" />
          {t('documents.centres.directions', 'Directions')}
        </a>
        <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="inline-flex items-center justify-center gap-2 h-12 rounded-md bg-surface shadow-hair font-semibold hover:bg-sunken transition-colors">
          <Phone size={20} weight="fill" />
          {t('documents.centres.call', 'Call')}
        </a>
      </div>

    </motion.li>
  );
}

function BringPanel({ className }: { className?: string }) {
  const { t } = useTranslation();
  return (
    <section aria-labelledby="bring-title" className={cx('rounded-lg bg-surface shadow-hair p-5', className)}>
      <h2 id="bring-title" className="font-semibold">{t('documents.centres.bring', 'What to bring')}</h2>
      <ul className="mt-3 space-y-2 text-small text-ink-2">
        {[
          ['documents.centres.bring1', 'Aadhaar card (original)'],
          ['documents.centres.bring2', 'Bank passbook (front page)'],
          ['documents.centres.bring3', 'Your Sahayak slip, on your phone or printed'],
          ['documents.centres.bring4', 'The phone linked to your Aadhaar, for the OTP'],
        ].map(([k, f]) => (
          <li key={k} className="flex gap-2">
            <CheckCircle size={18} weight="fill" className="text-patti shrink-0 mt-0.5" />
            {t(k, f)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export const HelpCentresScreen = () => {
  const { t, language } = useTranslation();
  const { setLanguageSheetOpen } = useAppStore();
  const [openOnly, setOpenOnly] = useState(false);
  const [langOnly, setLangOnly] = useState(false);
  const [activeId, setActiveId] = useState(helpCentres[0].id);
  const cardRefs = useRef<Record<string, HTMLLIElement | null>>({});

  const list = useMemo(
    () =>
      [...helpCentres]
        .sort((a, b) => a.distanceKm - b.distanceKm)
        .filter((c) => (!openOnly || openState(c).open) && (!langOnly || c.languages.includes(language))),
    [openOnly, langOnly, language]
  );
  const openCount = helpCentres.filter((c) => openState(c).open).length;
  const langLabel = LANGUAGE_META[language]?.label ?? language;

  const pick = (id: string) => {
    setActiveId(id);
    cardRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  return (
    <div className="pb-8">
      <PageHeader
        eyebrow={t('shell.nav.helpCentres', 'Help centres')}
        title={t('documents.centres.title', 'Help centres near you')}
        description={t('documents.centres.subtitle', 'Trained operators fill in your form with you. The government fee is ₹0 — a centre may charge at most ₹30 for its help.')}
      />

      <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6" role="group" aria-label={t('documents.centres.filters', 'Filter centres')}>
        <Chip selected={!openOnly && !langOnly} onClick={() => { setOpenOnly(false); setLangOnly(false); }}>
          {t('documents.centres.all', 'All')}
        </Chip>
        <Chip checkable selected={openOnly} onClick={() => setOpenOnly((v) => !v)} count={openCount} icon={<Clock size={16} />}>
          {t('documents.centres.openNow', 'Open now')}
        </Chip>
        <Chip checkable selected={langOnly} onClick={() => setLangOnly((v) => !v)} icon={<Translate size={16} />}>
          {t('documents.centres.speaks', 'Speaks')} {langLabel}
        </Chip>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] gap-6 lg:gap-8 items-start">
        <div className="lg:order-2 lg:sticky lg:top-[calc(var(--topbar-h)+16px)] space-y-4 min-w-0">
          <DistanceMap centres={list.length ? list : helpCentres} activeId={activeId} onPick={pick} />
          <StatutoryFeeBadge />
          <BringPanel className="hidden lg:block" />
        </div>

        <div className="lg:order-1 min-w-0">
          <p className="text-small text-ink-2 mb-3" aria-live="polite">
            <span className="num font-semibold text-ink">{list.length}</span> {t('documents.centres.found', 'centres, nearest first')}
          </p>
          {list.length === 0 ? (
            <EmptyState
              icon={<MapPin size={30} weight="duotone" />}
              title={t('documents.centres.emptyTitle', 'No centre matches right now')}
              body={t('documents.centres.emptyBody', 'Try removing a filter. Most centres open again at 9 in the morning.')}
              action={
                <button type="button" onClick={() => setLanguageSheetOpen(true)} className="h-11 px-4 rounded-md bg-surface shadow-hair font-semibold">
                  {t('shell.language.change', 'Change language')}
                </button>
              }
            />
          ) : (
            <ul className="grid grid-cols-1 gap-4">
              <AnimatePresence initial={false}>
                {list.map((c) => (
                  <CentreCard key={c.id} c={c} active={c.id === activeId} onSelect={() => setActiveId(c.id)} cardRef={(el) => (cardRefs.current[c.id] = el)} />
                ))}
              </AnimatePresence>
            </ul>
          )}
          <BringPanel className="mt-6 lg:hidden" />
          <p className="mt-6 text-micro text-ink-3">{t('documents.centres.demo', 'Sample centres for demonstration. Phone numbers are placeholders.')}</p>
        </div>
      </div>
    </div>
  );
};

export default HelpCentresScreen;
