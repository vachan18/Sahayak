import { motion, useSpring, useTransform, MotionValue, useMotionValue } from 'framer-motion';
import { Microphone, Stop, WarningCircle, SpeakerHigh } from '@phosphor-icons/react';
import { cx } from '../../ui/cx';
import { haptic } from '../../lib/haptics';

export type OrbState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'error';

interface VoiceOrbProps {
  state: OrbState;
  /** Live mic loudness 0…1 (from useMicLevel). Optional — falls back to idle breathing. */
  level?: MotionValue<number>;
  size?: number;
  onPress: () => void;
  label: string;
  className?: string;
}

// Hand-drawn feel: the rings are not perfect circles, they morph between soft blobs.
const BLOBS = [
  '47% 53% 51% 49% / 52% 47% 53% 48%',
  '53% 47% 46% 54% / 47% 54% 46% 53%',
  '49% 51% 55% 45% / 54% 49% 51% 46%',
  '47% 53% 51% 49% / 52% 47% 53% 48%',
];

/**
 * VOICE ORB — the haldi "sun" at the heart of Sahayak Sathi.
 *  idle       slow breathing, organic outline drifts
 *  listening  three rings swell with your actual voice (live mic level)
 *  thinking   a running stitch orbits the orb
 *  speaking   rings pulse outward in a steady rhythm
 *  error      the orb turns sindoor and gives one small shake
 */
export function VoiceOrb({ state, level, size = 128, onPress, label, className }: VoiceOrbProps) {
  const fallback = useMotionValue(0);
  const raw = level ?? fallback;
  const smooth = useSpring(raw, { stiffness: 260, damping: 24, mass: 0.6 });
  const r1 = useTransform(smooth, (v) => 1.08 + v * 0.22);
  const r2 = useTransform(smooth, (v) => 1.2 + v * 0.42);
  const r3 = useTransform(smooth, (v) => 1.34 + v * 0.62);
  const coreScale = useTransform(smooth, (v) => 1 + v * 0.06);

  const listening = state === 'listening';
  const speaking = state === 'speaking';
  const thinking = state === 'thinking';
  const error = state === 'error';
  const iconSize = Math.round(size * 0.34);

  const ring = 'absolute inset-0 pointer-events-none';
  const ringTone = error ? 'bg-sindoor' : 'bg-haldi';

  return (
    <div className={cx('relative grid place-items-center shrink-0', className)} style={{ width: size * 1.9, height: size * 1.9 }}>
      {/* Rings */}
      <div className="absolute grid place-items-center" style={{ width: size, height: size }}>
        {listening ? (
          <>
            <motion.span className={cx(ring, ringTone, 'opacity-[0.28]')} style={{ scale: r1, borderRadius: '50%' }} />
            <motion.span className={cx(ring, ringTone, 'opacity-[0.16]')} style={{ scale: r2, borderRadius: '50%' }} />
            <motion.span className={cx(ring, ringTone, 'opacity-[0.08]')} style={{ scale: r3, borderRadius: '50%' }} />
            {/* idle shimmer so it never looks frozen, even if mic level is unavailable */}
            <motion.span
              className={cx(ring, 'border-2 border-haldi')}
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.9, opacity: 0 }}
              transition={{ duration: 1.6, repeat: Infinity, ease: [0.2, 0, 0, 1] }}
              style={{ borderRadius: '50%' }}
            />
          </>
        ) : speaking ? (
          [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className={cx(ring, 'bg-haldi')}
              initial={{ scale: 1, opacity: 0.35 }}
              animate={{ scale: 1.75, opacity: 0 }}
              transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.6, ease: 'easeOut' }}
              style={{ borderRadius: '50%' }}
            />
          ))
        ) : thinking ? (
          <motion.svg className="absolute pointer-events-none" style={{ width: size * 1.36, height: size * 1.36 }} viewBox="0 0 100 100" animate={{ rotate: 360 }} transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }} aria-hidden>
            <circle cx="50" cy="50" r="47" fill="none" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="4 7" className="stroke-haldi" />
          </motion.svg>
        ) : (
          <>
            <motion.span
              className={cx(ring, ringTone, 'opacity-[0.18]')}
              animate={{ scale: [1.14, 1.24, 1.14], borderRadius: BLOBS }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.span
              className={cx(ring, ringTone, 'opacity-[0.09]')}
              animate={{ scale: [1.34, 1.46, 1.34], borderRadius: [...BLOBS].reverse() }}
              transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            />
          </>
        )}
      </div>

      {/* Core */}
      <motion.button
        type="button"
        onClick={() => {
          haptic(listening ? 'tap' : 'select');
          onPress();
        }}
        aria-label={label}
        aria-pressed={listening}
        whileTap={{ scale: 0.92 }}
        animate={error ? { x: [0, -8, 8, -5, 5, 0] } : { x: 0 }}
        transition={{ duration: 0.45 }}
        style={{ width: size, height: size, scale: listening ? coreScale : 1 }}
        className={cx(
          'relative rounded-full grid place-items-center transition-colors duration-medium',
          'shadow-[inset_0_-6px_0_rgb(0_0_0/0.10),0_18px_40px_-16px_rgb(var(--c-haldi-deep)/0.7)]',
          error ? 'bg-sindoor text-white' : 'bg-haldi text-[#111E33]'
        )}
      >
        <motion.span key={state} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 26 }}>
          {listening ? (
            <Stop size={iconSize} weight="fill" />
          ) : error ? (
            <WarningCircle size={iconSize} weight="fill" />
          ) : speaking ? (
            <SpeakerHigh size={iconSize} weight="fill" />
          ) : (
            <Microphone size={iconSize} weight="fill" />
          )}
        </motion.span>
      </motion.button>
    </div>
  );
}

/** Small inline orb for the composer bar once a conversation is underway. */
export function MiniOrb({ state, level, onPress, label }: Omit<VoiceOrbProps, 'size' | 'className'>) {
  return <VoiceOrb state={state} level={level} onPress={onPress} label={label} size={52} className="-m-[23px]" />;
}
