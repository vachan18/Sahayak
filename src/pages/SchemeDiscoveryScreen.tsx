import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MagnifyingGlass, Microphone, X, SlidersHorizontal, SquaresFour } from '@phosphor-icons/react';
import { useTranslation } from '../hooks/useTranslation';
import { useAppStore } from '../store/useAppStore';
import { SchemeCard } from '../components/schemes/SchemeCard';
import { SchemeComparisonTray } from '../components/schemes/SchemeComparisonTray';
import { useCatalog } from '../components/schemes/catalog';
import { lifeEventsData } from '../data/lifeEvents';
import type { BenefitType, LifeEventId, Scheme } from '../types';
import { PageHeader, Chip, Segmented, Sheet, Button, EmptyState, LIFE_EVENT, cx, ease } from '../ui';
import { haptic } from '../lib/haptics';

type SortKey = 'suggested' | 'money' | 'fast';
type WhoKey = 'farmer' | 'women' | 'student' | 'vendor' | 'elderly';

const WHO: { id: WhoKey; key: string; fallback: string; test: (s: Scheme) => boolean }[] = [
  { id: 'farmer', key: 'schemes.list.who.farmer', fallback: 'Farmers', test: (s) => (s.eligibilityCriteria.occupations ?? []).includes('farmer') || !!s.eligibilityCriteria.requiresLandTitle },
  { id: 'women', key: 'schemes.list.who.women', fallback: 'Women & girls', test: (s) => (s.eligibilityCriteria.genderAllowed ?? []).includes('female') || !!s.eligibilityCriteria.requiresMaternityStatus },
  { id: 'student', key: 'schemes.list.who.student', fallback: 'Students', test: (s) => !!s.eligibilityCriteria.requiresStudentEnrollment || s.benefitType === 'scholarship' },
  { id: 'vendor', key: 'schemes.list.who.vendor', fallback: 'Small business', test: (s) => s.lifeEventId === 'business_artisan' },
  { id: 'elderly', key: 'schemes.list.who.elderly', fallback: 'Elderly & poor families', test: (s) => !!s.eligibilityCriteria.requiresSeccOrBplRationCard || s.lifeEventId === 'health_elder' },
];

const KINDS: { id: BenefitType; key: string; fallback: string }[] = [
  { id: 'dbt_cash', key: 'schemes.kind.dbt', fallback: 'Money sent to your bank' },
  { id: 'health_insurance', key: 'schemes.kind.health', fallback: 'Free hospital treatment' },
  { id: 'credit_loan', key: 'schemes.kind.loan', fallback: 'Low-interest loan' },
  { id: 'scholarship', key: 'schemes.kind.scholarship', fallback: 'Scholarship for studies' },
];

function matchesQuery(s: Scheme, q: string, t: (k: string, f?: string) => string) {
  if (!q) return true;
  const hay = [s.id, s.titleKey, t(s.titleKey, s.titleKey), s.shortDescKey, s.ministryKey, t(LIFE_EVENT[s.lifeEventId]?.titleKey ?? ''), ...s.whoIsEligibleListKeys].join(' ').toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => hay.includes(word));
}

export const SchemeDiscoveryScreen: React.FC = () => {
  const { t } = useTranslation();
  const [params, setParams] = useSearchParams();
  const { setAiDrawerOpen, compareSchemeIds } = useAppStore();
  const catalog = useCatalog();

  const category = (params.get('category') || 'all') as LifeEventId | 'all';
  const urlQuery = params.get('q') || '';
  const [query, setQuery] = useState(urlQuery);
  const [sort, setSort] = useState<SortKey>('suggested');
  const [who, setWho] = useState<WhoKey[]>([]);
  const [kinds, setKinds] = useState<BenefitType[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => setQuery(urlQuery), [urlQuery]);

  // Keep ?q= in the URL (debounced) so a search can be shared or survives Back
  useEffect(() => {
    const id = window.setTimeout(() => {
      const next = new URLSearchParams(params);
      if (query.trim()) next.set('q', query.trim());
      else next.delete('q');
      if (next.toString() !== params.toString()) setParams(next, { replace: true });
    }, 300);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const setCategory = (id: LifeEventId | 'all') => {
    const next = new URLSearchParams(params);
    if (id === 'all') next.delete('category');
    else next.set('category', id);
    setParams(next, { replace: true });
  };

  const base = useMemo(() => catalog.filter((s) => matchesQuery(s, query.trim(), t)), [catalog, query, t]);

  const results = useMemo(() => {
    const list = base.filter(
      (s) =>
        (category === 'all' || s.lifeEventId === category) &&
        (who.length === 0 || who.some((w) => WHO.find((x) => x.id === w)!.test(s))) &&
        (kinds.length === 0 || kinds.includes(s.benefitType))
    );
    if (sort === 'money') return [...list].sort((a, b) => b.financialBenefit.amount - a.financialBenefit.amount);
    if (sort === 'fast') return [...list].sort((a, b) => a.processingSlaDays - b.processingSlaDays);
    return list;
  }, [base, category, who, kinds, sort]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: base.length };
    base.forEach((s) => (c[s.lifeEventId] = (c[s.lifeEventId] ?? 0) + 1));
    return c;
  }, [base]);

  const activeFilterCount = who.length + kinds.length;
  const clearAll = () => {
    setQuery('');
    setWho([]);
    setKinds([]);
    setSort('suggested');
    setParams({}, { replace: true });
  };
  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  return (
    <div className={cx(compareSchemeIds.length > 0 && 'pb-24')}>
      <PageHeader
        eyebrow={
          <span>
            <span className="num">{catalog.length}</span> {t('schemes.list.schemes', 'schemes')} · {t('schemes.list.eyebrow', 'Central and state schemes')}
          </span>
        }
        title={t('schemes.list.title', 'Find help for every part of life')}
        description={t('schemes.list.subtitle')}
      />

      {/* Search + filters. Sticky under the top bar on desktop, where lists get long. */}
      <div className="lg:sticky lg:top-[var(--topbar-h)] z-20 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10 py-3 bg-paper/95 lg:backdrop-blur-xl">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
          <label className="relative flex-1 min-w-0">
            <span className="sr-only">{t('schemes.list.searchLabel', 'Search schemes')}</span>
            <MagnifyingGlass size={20} className="absolute start-4 top-1/2 -translate-y-1/2 text-ink-3 pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('schemes.list.searchPlaceholder', 'Try “farmer”, “house”, “daughter”…')}
              className="w-full h-14 ps-12 pe-[6.5rem] rounded-md bg-surface shadow-hair text-body placeholder:text-ink-3 focus:outline-none focus:shadow-[0_0_0_2px_rgb(var(--c-neel))] [&::-webkit-search-cancel-button]:hidden"
            />
            <span className="absolute end-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <AnimatePresence>
                {query && (
                  <motion.button
                    type="button"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => setQuery('')}
                    aria-label={t('schemes.list.clearSearch', 'Clear search')}
                    className="w-10 h-10 rounded-full grid place-items-center text-ink-3 hover:bg-sunken"
                  >
                    <X size={18} weight="bold" />
                  </motion.button>
                )}
              </AnimatePresence>
              <motion.button
                type="button"
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  haptic('select');
                  setAiDrawerOpen(true);
                }}
                aria-label={t('schemes.list.speak', 'Speak to search')}
                title={t('schemes.list.speak', 'Speak to search')}
                className="w-11 h-11 rounded-sm bg-haldi text-[#111E33] grid place-items-center"
              >
                <Microphone size={22} weight="fill" />
              </motion.button>
            </span>
          </label>
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            aria-label={`${t('schemes.list.filters', 'Filters')}${activeFilterCount ? ` (${activeFilterCount})` : ''}`}
            className={cx('relative h-14 w-14 sm:w-auto sm:px-4 shrink-0 rounded-md flex items-center justify-center gap-2 font-semibold transition-colors', activeFilterCount ? 'bg-ink text-paper' : 'bg-surface shadow-hair hover:bg-sunken')}
          >
            <SlidersHorizontal size={22} />
            <span className="hidden sm:inline">{t('schemes.list.filters', 'Filters')}</span>
            {activeFilterCount > 0 && <span className="num text-micro w-5 h-5 rounded-full bg-haldi text-[#111E33] grid place-items-center">{activeFilterCount}</span>}
          </button>
        </form>

        {/* Life-event rail — scrolls sideways on phones, wraps on desktop */}
        <div className="mt-3 -mx-4 px-4 sm:mx-0 sm:px-0 flex gap-2 overflow-x-auto no-scrollbar sm:flex-wrap" role="group" aria-label={t('home.needs.title', 'Browse by what is happening in your life')}>
          <Chip selected={category === 'all'} onClick={() => setCategory('all')} icon={<SquaresFour size={18} />} count={counts.all ?? 0}>
            {t('schemes.list.all', 'All')}
          </Chip>
          {lifeEventsData.map((ev) => {
            const meta = LIFE_EVENT[ev.id as LifeEventId];
            const Icon = meta.icon;
            return (
              <Chip key={ev.id} selected={category === ev.id} onClick={() => setCategory(ev.id as LifeEventId)} icon={<Icon size={18} weight={category === ev.id ? 'fill' : 'duotone'} />} count={counts[ev.id] ?? 0}>
                {t(meta.titleKey)}
              </Chip>
            );
          })}
        </div>
      </div>

      <div className="mt-4 mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-2" aria-live="polite">
          {t('schemes.list.showing', 'Showing')} <span className="num font-semibold text-ink">{results.length}</span>{' '}
          {results.length === 1 ? t('schemes.list.scheme', 'scheme') : t('schemes.list.schemes', 'schemes')}
        </p>
        <Segmented
          size="sm"
          value={sort}
          onChange={setSort}
          label={t('schemes.list.sortLabel', 'Sort schemes')}
          layoutKey="scheme-sort"
          options={[
            { value: 'suggested', label: t('schemes.list.sortSuggested', 'Suggested') },
            { value: 'money', label: t('schemes.list.sortMoney', 'Most money') },
            { value: 'fast', label: t('schemes.list.sortFast', 'Fastest') },
          ]}
        />
      </div>

      {results.length === 0 ? (
        <EmptyState
          icon={<Microphone size={30} weight="duotone" />}
          title={t('schemes.list.emptyTitle', 'Nothing matched that')}
          body={t('schemes.list.emptyBody')}
          action={
            <div className="flex flex-wrap justify-center gap-2">
              <Button onClick={() => setAiDrawerOpen(true)} iconStart={<Microphone size={20} weight="fill" />}>
                {t('schemes.list.speak', 'Speak to search')}
              </Button>
              <Button variant="secondary" onClick={clearAll}>
                {t('schemes.list.clearAll', 'Clear all filters')}
              </Button>
            </div>
          }
        />
      ) : (
        <motion.ul layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((s, i) => (
              <motion.li
                key={s.id}
                layout
                className="min-w-0"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.32, ease: ease.out, delay: Math.min(i, 8) * 0.03 } }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15, ease: ease.in } }}
                transition={{ layout: { type: 'spring', stiffness: 380, damping: 36 } }}
              >
                <SchemeCard scheme={s} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}

      <Sheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title={t('schemes.list.filtersTitle', 'Narrow down')}
        closeLabel={t('navClose', 'Close')}
        size="sm"
        desktop="side"
        footer={
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setWho([]);
                setKinds([]);
              }}
            >
              {t('schemes.list.reset', 'Reset')}
            </Button>
            <Button variant="solid" block onClick={() => setFiltersOpen(false)}>
              {t('schemes.list.showResults', 'Show results')} (<span className="num">{results.length}</span>)
            </Button>
          </div>
        }
      >
        <fieldset className="pt-2">
          <legend className="font-semibold mb-3">{t('schemes.list.whoFor', 'Who is it for?')}</legend>
          <div className="flex flex-wrap gap-2">
            {WHO.map((w) => (
              <Chip key={w.id} checkable selected={who.includes(w.id)} onClick={() => setWho((l) => toggle(l, w.id))}>
                {t(w.key, w.fallback)}
              </Chip>
            ))}
          </div>
        </fieldset>
        <fieldset className="pt-6">
          <legend className="font-semibold mb-3">{t('schemes.list.whatKind', 'What kind of help?')}</legend>
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <Chip key={k.id} checkable selected={kinds.includes(k.id)} onClick={() => setKinds((l) => toggle(l, k.id))}>
                {t(k.key, k.fallback)}
              </Chip>
            ))}
          </div>
        </fieldset>
      </Sheet>

      <SchemeComparisonTray />
    </div>
  );
};

export default SchemeDiscoveryScreen;
