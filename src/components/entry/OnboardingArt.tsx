import { motion } from 'framer-motion';
import { Check, ShieldCheck, Timer } from '@phosphor-icons/react';
import { useTranslation } from '../../hooks/useTranslation';
import { LifeGlyph } from '../../ui/domain';
import type { LifeEventId } from '../../types';

const ORBIT: LifeEventId[] = ['farming', 'health_elder', 'women_child', 'education_youth', 'business_artisan', 'housing_utilities'];

/** 1 · Life, not ministries — six life events orbit a haldi sun, tied by one thread. */
export function LifeOrbitArt() {
  const R = 108;
  return (
    <div className="relative w-[288px] h-[288px] mx-auto" aria-hidden>
      <motion.svg className="absolute inset-0 text-line-strong" viewBox="0 0 288 288" initial={{ rotate: -20, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.2, 0, 0, 1] }}>
        <circle cx="144" cy="144" r={R} fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5 7" />
      </motion.svg>
      <motion.div
        className="absolute left-1/2 top-1/2 -ml-11 -mt-11 rounded-full bg-haldi"
        style={{ width: 88, height: 88 }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
      >
        <motion.span className="absolute inset-0 rounded-full bg-haldi" animate={{ scale: [1, 1.35], opacity: [0.35, 0] }} transition={{ duration: 2.2, repeat: Infinity }} />
      </motion.div>
      {ORBIT.map((id, i) => {
        const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
        const x = 144 + R * Math.cos(a) - 32;
        const y = 144 + R * Math.sin(a) - 32;
        return (
          <motion.div
            key={id}
            className="absolute"
            style={{ left: x, top: y }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
            transition={{ scale: { delay: 0.25 + i * 0.08, type: 'spring', stiffness: 420, damping: 18 }, opacity: { delay: 0.25 + i * 0.08 }, y: { delay: 1 + i * 0.2, duration: 3, repeat: Infinity, ease: 'easeInOut' } }}
          >
            <LifeGlyph id={id} size="lg" className="shadow-lift" />
          </motion.div>
        );
      })}
    </div>
  );
}

/** 2 · Two minutes — four questions tick off one by one and an amount rises up. */
export function QuickCheckArt() {
  const { t } = useTranslation();
  const rows = ['home.ent.q1', 'home.ent.q2', 'home.ent.q3', 'home.ent.q4'];
  return (
    <div className="relative w-[288px] mx-auto" aria-hidden>
      <motion.div initial={{ y: 20, opacity: 0, rotate: -2 }} animate={{ y: 0, opacity: 1, rotate: -2 }} transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }} className="rounded-xl bg-surface shadow-float p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="h-2 w-20 rounded-full bg-sunken" />
          <span className="inline-flex items-center gap-1 text-micro font-semibold text-ink-2 num">
            <Timer size={16} weight="duotone" /> 2:00
          </span>
        </div>
        <ul className="space-y-2.5">
          {rows.map((k, i) => (
            <li key={k} className="flex items-center gap-3 h-11 px-3 rounded-md bg-sunken">
              <motion.span
                className="w-6 h-6 rounded-full grid place-items-center bg-patti text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + i * 0.35, type: 'spring', stiffness: 500, damping: 20 }}
              >
                <Check size={14} weight="bold" />
              </motion.span>
              <span className="text-small font-medium">{t(k)}</span>
            </li>
          ))}
        </ul>
      </motion.div>
      <motion.div
        initial={{ scale: 0.6, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 2, type: 'spring', stiffness: 380, damping: 16 }}
        className="absolute -bottom-12 -end-3 rotate-3 rounded-lg bg-hero-patti text-white px-5 py-3 shadow-float"
      >
        <p className="text-[2rem] leading-none font-semibold num-display">₹6,000</p>
        <p className="text-micro text-white/85 mt-1">{t('entry.onboard.2.result', 'could be yours')}</p>
      </motion.div>
    </div>
  );
}

/** 3 · ₹0 — the agent's demand is struck out; the real fee and the legal cap remain. */
export function FeePromiseArt() {
  const { t } = useTranslation();
  return (
    <div className="relative w-[288px] mx-auto space-y-3" aria-hidden>
      <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.45 }} className="relative rounded-lg bg-sindoor-tint text-sindoor px-5 py-4 flex items-baseline justify-between -rotate-2">
        <span className="text-small font-semibold">{t('entry.onboard.3.agent', 'Agent asks')}</span>
        <span className="text-[1.75rem] font-semibold num-display">₹500</span>
        <motion.span className="absolute start-3 end-3 top-1/2 h-[3px] rounded-full bg-sindoor origin-left rtl:origin-right" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.7, duration: 0.45, ease: [0.2, 0, 0, 1] }} />
      </motion.div>
      <motion.div initial={{ y: 24, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }} transition={{ delay: 1.1, type: 'spring', stiffness: 320, damping: 20 }} className="rounded-xl bg-surface shadow-float px-5 py-5 flex items-center gap-4">
        <span className="w-14 h-14 rounded-full bg-patti-tint text-patti grid place-items-center shrink-0">
          <ShieldCheck size={32} weight="duotone" />
        </span>
        <span className="flex-1">
          <span className="block text-small text-ink-2">{t('entry.onboard.3.fee', 'Government fee')}</span>
          <span className="block text-[3rem] leading-none font-semibold num-display text-patti">₹0</span>
        </span>
      </motion.div>
      <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1.4, duration: 0.45 }} className="rounded-lg bg-haldi-tint px-5 py-3.5 flex items-baseline justify-between rotate-1">
        <span className="text-small font-semibold text-haldi-deep">{t('entry.onboard.3.cap', 'Help centre, at most')}</span>
        <span className="text-[1.5rem] font-semibold num-display text-ink">₹30</span>
      </motion.div>
    </div>
  );
}
