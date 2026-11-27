import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CaretUpDown, Check, UsersThree } from '@phosphor-icons/react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../hooks/useTranslation';
import { cx } from '../../ui/cx';
import { haptic } from '../../lib/haptics';
import type { UserProfile } from '../../types';

const AVATAR_TONES = ['bg-khet-tint text-khet', 'bg-vidya-tint text-vidya', 'bg-mamta-tint text-mamta', 'bg-sehat-tint text-sehat', 'bg-kaarigar-tint text-kaarigar'];

export function displayName(p?: UserProfile) {
  return (p?.name ?? '').split('(')[0].trim();
}

export function Avatar({ profile, index = 0, size = 40, className }: { profile?: UserProfile; index?: number; size?: number; className?: string }) {
  const initial = displayName(profile).charAt(0).toUpperCase() || '•';
  return (
    <span
      className={cx('inline-grid place-items-center rounded-full font-semibold shrink-0', AVATAR_TONES[index % AVATAR_TONES.length], className)}
      style={{ width: size, height: size, fontSize: size * 0.42 }}
      aria-hidden
    >
      {initial}
    </span>
  );
}

/**
 * "Checking for: Ramesh" — the household proxy pattern.
 * One phone serves 4–6 people; the family member being helped is always visible
 * and one tap away from changing, so answers never get mixed up between people.
 */
export function FamilySwitcher({ placement = 'up' }: { placement?: 'up' | 'down' }) {
  const { t } = useTranslation();
  const { profiles, activeProfileId, setActiveProfileId, pushToast } = useAppStore();
  const [open, setOpen] = useState(false);
  const activeIndex = Math.max(0, profiles.findIndex((p) => p.id === activeProfileId));
  const active = profiles[activeIndex];

  return (
    <div className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t('shell.family.switch', 'Switch family member')}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-3 p-2.5 rounded-md hover:bg-sunken text-start transition-colors"
      >
        <Avatar profile={active} index={activeIndex} />
        <span className="flex-1 min-w-0">
          <span className="block text-micro text-ink-3">{t('shell.family.checkingFor', 'Checking for')}</span>
          <span className="block text-small font-semibold truncate">{displayName(active)}</span>
        </span>
        <CaretUpDown size={18} className="text-ink-3" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
            <motion.ul
              role="listbox"
              initial={{ opacity: 0, y: placement === 'up' ? 8 : -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: placement === 'up' ? 4 : -4, transition: { duration: 0.12 } }}
              transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
              className={cx(
                'absolute z-20 inset-x-0 p-1.5 rounded-md bg-surface shadow-float',
                placement === 'up' ? 'bottom-full mb-2 origin-bottom' : 'top-full mt-2 origin-top'
              )}
            >
              {profiles.map((p, i) => {
                const selected = p.id === activeProfileId;
                return (
                  <li key={p.id} role="option" aria-selected={selected}>
                    <button
                      type="button"
                      onClick={() => {
                        haptic('select');
                        setActiveProfileId(p.id);
                        setOpen(false);
                        if (!selected) pushToast({ message: `${t('shell.family.checkingFor', 'Checking for')} ${displayName(p)}`, tone: 'neutral' });
                      }}
                      className="w-full flex items-center gap-3 p-2 rounded-sm hover:bg-sunken text-start"
                    >
                      <Avatar profile={p} index={i} size={34} />
                      <span className="flex-1 min-w-0 text-small font-medium truncate">{displayName(p)}</span>
                      {selected && <Check size={18} weight="bold" className="text-patti" />}
                    </button>
                  </li>
                );
              })}
              <li className="border-t border-line mt-1 pt-1">
                <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-3 p-2 rounded-sm hover:bg-sunken text-small font-semibold text-neel-ink">
                  <span className="w-[34px] grid place-items-center">
                    <UsersThree size={20} weight="duotone" />
                  </span>
                  {t('shell.family.manage', 'Manage family')}
                </Link>
              </li>
            </motion.ul>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
