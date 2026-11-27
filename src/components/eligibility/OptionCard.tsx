import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import {
  Plant,
  Storefront,
  GraduationCap,
  Hammer,
  Heart,
  Scissors,
  GenderFemale,
  GenderMale,
  GenderNonbinary,
  CheckCircle,
  XCircle,
  Check,
  type Icon as PhosphorIcon,
} from '@phosphor-icons/react';
import type { QuestionOption } from '../../types';
import { cx, toneTint, type Tone } from '../../ui';

const ICONS: Record<string, { icon: PhosphorIcon; tone: Tone }> = {
  Wheat: { icon: Plant, tone: 'khet' },
  Store: { icon: Storefront, tone: 'kaarigar' },
  GraduationCap: { icon: GraduationCap, tone: 'vidya' },
  Hammer: { icon: Hammer, tone: 'ghar' },
  Heart: { icon: Heart, tone: 'mamta' },
  Scissors: { icon: Scissors, tone: 'kaarigar' },
  CheckCircle2: { icon: CheckCircle, tone: 'patti' },
  XCircle: { icon: XCircle, tone: 'neutral' },
};

const GENDER: Record<string, { icon: PhosphorIcon; tone: Tone }> = {
  female: { icon: GenderFemale, tone: 'mamta' },
  male: { icon: GenderMale, tone: 'vidya' },
  other: { icon: GenderNonbinary, tone: 'sehat' },
};

/** Ordered scales (land, income) get a "level" glyph instead of an arbitrary icon. */
const LEVELS: Record<string, Record<string, number>> = {
  landholdingAcres: { '0': 0, '1.5': 1, '4': 2, '10': 3 },
  annualIncome: { '100000': 1, '240000': 2, '500000': 3, '1000000': 4 },
};

function LevelGlyph({ level, max }: { level: number; max: number }) {
  return (
    <span className="w-14 h-14 rounded-md bg-sunken grid place-items-center shrink-0" aria-hidden>
      <span className="flex items-end gap-[3px] h-6">
        {Array.from({ length: max }).map((_, i) => (
          <span key={i} className={cx('w-[6px] rounded-full', i < level ? 'bg-neel' : 'bg-line-strong')} style={{ height: `${30 + (i / Math.max(1, max - 1)) * 70}%` }} />
        ))}
      </span>
    </span>
  );
}

export function OptionGlyph({ option, fieldName }: { option: QuestionOption; fieldName: string }) {
  const levels = LEVELS[fieldName];
  if (levels && String(option.value) in levels) {
    const max = Math.max(...Object.values(levels));
    return <LevelGlyph level={levels[String(option.value)]} max={max} />;
  }
  const meta = (fieldName === 'gender' && GENDER[String(option.value)]) || (option.iconName && ICONS[option.iconName]) || { icon: CheckCircle, tone: 'neel' as Tone };
  const Icon = meta.icon;
  return (
    <span className={cx('w-14 h-14 rounded-md grid place-items-center shrink-0', toneTint[meta.tone])} aria-hidden>
      <Icon size={30} weight="duotone" />
    </span>
  );
}

interface OptionCardProps {
  option: QuestionOption;
  fieldName: string;
  label: string;
  sublabel?: string;
  selected: boolean;
  index: number;
  tabIndex: number;
  onSelect: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

/** A single answer. Whole card is the target (≥76px tall), radio semantics, number shortcut badge. */
export const OptionCard = forwardRef<HTMLButtonElement, OptionCardProps>(function OptionCard(
  { option, fieldName, label, sublabel, selected, index, tabIndex, onSelect, onKeyDown },
  ref
) {
  return (
    <motion.button
      ref={ref}
      type="button"
      role="radio"
      aria-checked={selected}
      tabIndex={tabIndex}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      whileTap={{ scale: 0.98 }}
      className={cx(
        'group relative w-full h-full min-h-[84px] flex items-center gap-4 p-3.5 pe-12 rounded-lg text-start transition-[box-shadow,background-color] duration-short ease-out',
        selected ? 'bg-neel-tint shadow-[0_0_0_2px_rgb(var(--c-neel))]' : 'bg-surface shadow-hair hover:shadow-lift'
      )}
    >
      <OptionGlyph option={option} fieldName={fieldName} />
      <span className="flex-1 min-w-0">
        <span className="block font-semibold leading-snug text-ink">{label}</span>
        {sublabel && <span className="block mt-0.5 text-small text-ink-2 leading-snug">{sublabel}</span>}
      </span>
      <span className="absolute end-3.5 top-1/2 -translate-y-1/2">
        {selected ? (
          <motion.span initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 520, damping: 26 }} className="w-8 h-8 rounded-full bg-neel text-on-neel grid place-items-center">
            <Check size={16} weight="bold" />
          </motion.span>
        ) : (
          <span className="hidden md:grid w-7 h-7 rounded-xs bg-sunken text-ink-3 place-items-center num text-micro font-semibold" aria-hidden>
            {index + 1}
          </span>
        )}
      </span>
    </motion.button>
  );
});
