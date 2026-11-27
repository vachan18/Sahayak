import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { MagnifyingGlass, ArrowRight, Microphone, ListChecks, Files, Path, MapPin, Translate, TextAa, Printer } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { LifeGlyph } from '../../ui/domain';
import { cx } from '../../ui/cx';
import { formatINR } from '../../ui/Feedback';

interface Item {
  id: string;
  group: 'schemes' | 'actions';
  label: string;
  hint?: string;
  icon: React.ReactNode;
  run: () => void;
}

/**
 * Ctrl/⌘ K command palette — built for CSC operators and family proxies who help
 * many people a day and know exactly where they want to go.
 * Fully keyboard driven: ↑ ↓ to move, Enter to open, Esc to close.
 */
export function CommandPalette() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isCommandOpen, setCommandOpen, schemes, setAiDrawerOpen, setLanguageSheetOpen, setComfortOpen } = useAppStore();
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandOpen(!useAppStore.getState().isCommandOpen);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCommandOpen]);

  useEffect(() => {
    if (isCommandOpen) {
      setQ('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isCommandOpen]);

  const close = () => setCommandOpen(false);
  const go = (to: string) => () => {
    navigate(to);
    close();
  };

  const items = useMemo<Item[]>(() => {
    const actions: Item[] = [
      { id: 'speak', group: 'actions', label: t('shell.nav.speak', 'Speak'), hint: t('shell.assistantHint', 'Ask anything, in your language'), icon: <Microphone size={20} weight="duotone" />, run: () => { close(); setAiDrawerOpen(true); } },
      { id: 'check', group: 'actions', label: t('shell.nav.checkLong', 'Check eligibility'), icon: <ListChecks size={20} weight="duotone" />, run: go('/eligibility') },
      { id: 'papers', group: 'actions', label: t('shell.nav.papers', 'Papers'), icon: <Files size={20} weight="duotone" />, run: go('/documents') },
      { id: 'track', group: 'actions', label: t('shell.nav.track', 'Track'), icon: <Path size={20} weight="duotone" />, run: go('/tracker') },
      { id: 'centres', group: 'actions', label: t('shell.nav.helpCentres', 'Help centres'), icon: <MapPin size={20} weight="duotone" />, run: go('/help-centres') },
      { id: 'slip', group: 'actions', label: t('cscSlipTitle', 'CSC slip'), icon: <Printer size={20} weight="duotone" />, run: go('/csc-slip') },
      { id: 'lang', group: 'actions', label: t('shell.language.change', 'Change language'), icon: <Translate size={20} weight="duotone" />, run: () => { close(); setLanguageSheetOpen(true); } },
      { id: 'comfort', group: 'actions', label: t('shell.comfort.title', 'Reading comfort'), icon: <TextAa size={20} weight="duotone" />, run: () => { close(); setComfortOpen(true); } },
    ];
    const schemeItems: Item[] = schemes.map((s) => ({
      id: s.id,
      group: 'schemes',
      label: t(s.titleKey, s.titleKey),
      hint: `₹${formatINR(s.financialBenefit.amount)} · ${t(s.financialBenefit.frequencyKey, '')}`,
      icon: <LifeGlyph id={s.lifeEventId} size="sm" />,
      run: go(`/schemes/${s.id}`),
    }));
    const needle = q.trim().toLowerCase();
    const all = [...schemeItems, ...actions];
    if (!needle) return [...schemeItems.slice(0, 5), ...actions];
    return all.filter((i) => `${i.label} ${i.hint ?? ''} ${i.id}`.toLowerCase().includes(needle));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, schemes, t]);

  useEffect(() => setCursor(0), [q]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(items.length - 1, c + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      items[cursor]?.run();
    } else if (e.key === 'Escape') {
      close();
    }
  };

  const groups: Array<Item['group']> = ['schemes', 'actions'];
  let flatIndex = -1;

  return (
    <AnimatePresence>
      {isCommandOpen && (
        <div className="fixed inset-0 z-[65] flex items-start justify-center px-3 pt-[10vh]">
          <motion.div className="absolute inset-0 bg-[rgb(9_14_25/0.45)] dark:bg-black/60 backdrop-blur-[3px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close} aria-hidden />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('shell.search.open', 'Search')}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.22, ease: [0.2, 0, 0, 1] } }}
            exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.12 } }}
            className="relative w-full max-w-xl rounded-xl bg-surface shadow-float overflow-hidden"
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 px-5 border-b border-line">
              <MagnifyingGlass size={22} weight="bold" className="text-ink-3 shrink-0" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder={t('shell.search.placeholder', 'Search schemes, papers or help…')}
                role="combobox"
                aria-expanded="true"
                aria-controls="cmd-list"
                aria-activedescendant={items[cursor] ? `cmd-${items[cursor].id}` : undefined}
                className="flex-1 h-16 bg-transparent text-lead placeholder:text-ink-3 focus:outline-none"
              />
              <kbd className="num text-micro px-2 py-0.5 rounded-xs bg-sunken text-ink-2">Esc</kbd>
            </div>
            <ul id="cmd-list" role="listbox" className="max-h-[56vh] overflow-y-auto p-2">
              {items.length === 0 && (
                <li className="p-6 text-center text-ink-2">
                  <p>{t('shell.search.noResults')}</p>
                  <button type="button" onClick={() => { close(); setAiDrawerOpen(true); }} className="mt-3 inline-flex items-center gap-2 h-10 px-4 rounded-full bg-haldi text-[#111E33] font-semibold">
                    <Microphone size={18} weight="fill" /> {t('shell.search.speakInstead', 'Speak instead')}
                  </button>
                </li>
              )}
              {groups.map((g) => {
                const groupItems = items.filter((i) => i.group === g);
                if (!groupItems.length) return null;
                return (
                  <li key={g} role="presentation">
                    <p className="px-3 pt-3 pb-1.5 text-micro font-semibold text-ink-3">{g === 'schemes' ? t('shell.search.schemes', 'Schemes') : t('shell.search.actions', 'Quick actions')}</p>
                    <ul role="presentation">
                      {groupItems.map((item) => {
                        flatIndex += 1;
                        const idx = flatIndex;
                        const active = idx === cursor;
                        return (
                          <li
                            key={item.id}
                            id={`cmd-${item.id}`}
                            role="option"
                            aria-selected={active}
                            onMouseMove={() => setCursor(idx)}
                            onClick={item.run}
                            className={cx('relative flex items-center gap-3 px-3 min-h-[52px] rounded-md cursor-pointer transition-colors duration-micro', active && 'text-ink bg-sunken')}
                          >
                            <span className="relative grid place-items-center w-9 shrink-0 text-ink-2">{item.icon}</span>
                            <span className="relative flex-1 min-w-0">
                              <span className="block font-medium truncate">{item.label}</span>
                              {item.hint && <span className="block text-micro text-ink-3 truncate num">{item.hint}</span>}
                            </span>
                            {active && <ArrowRight size={18} className="relative text-ink-3 flip-rtl" />}
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
