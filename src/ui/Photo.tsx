import { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { LifeEventId } from '../types';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../hooks/useTranslation';
import { cx } from './cx';

/**
 * Real people, real places. Photography of the people Sahayak serves (Unsplash License,
 * credits in public/people/CREDITS.md). Each image ships at 640 px and 1200 px WebP.
 * `pos` is the focal point so faces stay in frame at every crop.
 */
export const PHOTOS = {
  farmer: { src: '/people/farmer', pos: '50% 40%', altKey: 'photo.farmer', alt: 'A farmer standing at the edge of a green rice field' },
  farmerOld: { src: '/people/farmer-old', pos: '50% 30%', altKey: 'photo.farmerOld', alt: 'An elderly man walking on a village road' },
  mother: { src: '/people/mother', pos: '45% 40%', altKey: 'photo.mother', alt: 'A young mother holding her newborn baby' },
  weaver: { src: '/people/weaver', pos: '50% 55%', altKey: 'photo.weaver', alt: 'A woman weaving cloth on a traditional loom' },
  weaverMan: { src: '/people/weaver-man', pos: '60% 35%', altKey: 'photo.weaverMan', alt: 'A handloom weaver at work on a patterned saree' },
  elder: { src: '/people/elder', pos: '30% 35%', altKey: 'photo.elder', alt: 'A smiling elderly woman in a white sari' },
  student: { src: '/people/student', pos: '65% 30%', altKey: 'photo.student', alt: 'A young woman reading in a library' },
  girl: { src: '/people/girl', pos: '35% 30%', altKey: 'photo.girl', alt: 'A girl holding on to her mother' },
  home: { src: '/people/home', pos: '70% 50%', altKey: 'photo.home', alt: 'A woman smiling at the door of her home' },
} as const;

export type PhotoId = keyof typeof PHOTOS;

export const LIFE_EVENT_PHOTO: Record<LifeEventId, PhotoId> = {
  farming: 'farmer',
  health_elder: 'elder',
  women_child: 'mother',
  education_youth: 'student',
  business_artisan: 'weaverMan',
  housing_utilities: 'home',
};

interface PhotoProps {
  id: PhotoId;
  className?: string;
  /** CSS sizes hint for srcset selection */
  sizes?: string;
  /** Decorative images get empty alt (the adjacent text already says it) */
  decorative?: boolean;
  priority?: boolean;
  /** Override focal point */
  position?: string;
  rounded?: string;
  /** Gentle scroll-linked drift (hero images only) */
  parallax?: boolean;
}

export function Photo({ id, className, sizes = '(min-width: 1024px) 40vw, 90vw', decorative, priority, position, rounded = 'rounded-lg', parallax }: PhotoProps) {
  const { t } = useTranslation();
  const isLite = useAppStore((s) => s.isLiteMode);
  const [loaded, setLoaded] = useState(false);
  const p = PHOTOS[id];
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], parallax && !reduce ? ['-6%', '6%'] : ['0%', '0%']);

  return (
    <div ref={ref} className={cx('relative overflow-hidden bg-sunken', !loaded && !isLite && 'skeleton', rounded, className)}>
      {!isLite && (
        <motion.img
          src={`${p.src}.webp`}
          srcSet={`${p.src}-sm.webp 640w, ${p.src}.webp 1200w`}
          sizes={sizes}
          alt={decorative ? '' : t(p.altKey, p.alt)}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          onLoad={() => setLoaded(true)}
          initial={false}
          animate={{ opacity: loaded ? 1 : 0, scale: parallax ? (loaded ? 1.14 : 1.18) : loaded ? 1 : 1.04 }}
          transition={{ duration: 0.6, ease: [0.2, 0, 0, 1] }}
          style={{ objectPosition: position ?? p.pos, y }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
    </div>
  );
}
