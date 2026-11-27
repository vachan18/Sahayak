import { useId } from 'react';
import type { SampleKind } from './paperInfo';

export type Flaw = 'none' | 'blur' | 'glare' | 'cropped' | 'dark';

/**
 * Illustrated stand-in for a real paper. No personal data, no real logos —
 * just enough structure (photo box, number lines, seal) that a person can
 * recognise "the front page of my passbook" and see what a good photo looks like.
 */
export function MockDocument({ kind, flaw = 'none', className }: { kind: SampleKind; flaw?: Flaw; className?: string }) {
  const id = useId().replace(/:/g, '');
  const ink = '#2B2A26';
  const faint = '#C9BFAC';
  const paper = kind === 'land' ? '#F4EBD6' : kind === 'passbook' ? '#E9EEF6' : '#FBF7EE';
  const accent = kind === 'passbook' ? '#2C607C' : kind === 'land' ? '#8C5C06' : kind === 'id' ? '#23336B' : '#A04E08';

  const transform =
    flaw === 'cropped' ? 'translate(34 18) rotate(4 120 80)' : flaw === 'none' ? 'rotate(-1.5 120 80)' : 'rotate(-3 120 80)';

  return (
    <svg viewBox="0 0 240 170" className={className} role="img" aria-hidden xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id={`b${id}`}>
          <feGaussianBlur stdDeviation="2.4" />
        </filter>
        <radialGradient id={`g${id}`} cx="0.62" cy="0.38" r="0.42">
          <stop offset="0" stopColor="#fff" stopOpacity="0.97" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <pattern id={`t${id}`} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#8A7A5C" />
          <path d="M0 5h10M5 0v10" stroke="#7A6B4E" strokeWidth="0.6" />
        </pattern>
      </defs>

      {/* table / background the paper rests on */}
      <rect width="240" height="170" fill={`url(#t${id})`} />

      <g transform={transform} filter={flaw === 'blur' ? `url(#b${id})` : undefined}>
        <rect x="22" y="16" width="196" height="138" rx="6" fill={paper} stroke={faint} />
        {/* header band */}
        <rect x="22" y="16" width="196" height="24" rx="6" fill={accent} />
        <rect x="22" y="32" width="196" height="8" fill={accent} />
        <rect x="32" y="24" width="64" height="6" rx="3" fill="#fff" opacity="0.9" />
        <rect x="160" y="24" width="46" height="6" rx="3" fill="#fff" opacity="0.6" />

        {kind === 'land' ? (
          <>
            {/* survey grid */}
            {[0, 1, 2, 3].map((r) => (
              <g key={r}>
                <rect x="32" y={50 + r * 18} width="176" height="16" fill="none" stroke={faint} />
                <rect x="38" y={56 + r * 18} width={30 + r * 6} height="4" rx="2" fill={ink} opacity="0.75" />
                <rect x="110" y={56 + r * 18} width="50" height="4" rx="2" fill={ink} opacity="0.45" />
              </g>
            ))}
            <rect x="32" y="128" width="70" height="4" rx="2" fill={ink} opacity="0.5" />
          </>
        ) : (
          <>
            {/* photo */}
            <rect x="32" y="50" width="44" height="54" rx="4" fill="#D8D0BF" />
            <circle cx="54" cy="70" r="10" fill="#B9AE98" />
            <path d="M38 102c3-12 10-16 16-16s13 4 16 16" fill="#B9AE98" />
            {/* fields */}
            {[0, 1, 2, 3].map((r) => (
              <g key={r}>
                <rect x="88" y={54 + r * 14} width="30" height="3.5" rx="1.75" fill={ink} opacity="0.35" />
                <rect x="122" y={54 + r * 14} width={kind === 'passbook' && r === 1 ? 78 : 56 - r * 6} height="4" rx="2" fill={ink} opacity="0.8" />
              </g>
            ))}
            {kind === 'id' && (
              <g>
                {[0, 1, 2, 3].map((i) => (
                  <rect key={i} x={32 + i * 26} y="118" width="22" height="8" rx="2" fill={ink} opacity="0.85" />
                ))}
              </g>
            )}
            {kind === 'passbook' && <rect x="88" y="112" width="60" height="5" rx="2.5" fill={accent} opacity="0.9" />}
          </>
        )}

        {/* seal */}
        <g opacity="0.7">
          <circle cx="186" cy="124" r="16" fill="none" stroke={accent} strokeWidth="2" />
          <circle cx="186" cy="124" r="11" fill="none" stroke={accent} strokeWidth="1" strokeDasharray="2 2" />
        </g>
      </g>

      {flaw === 'glare' && <ellipse cx="150" cy="70" rx="80" ry="54" fill={`url(#g${id})`} />}
      {flaw === 'dark' && <rect width="240" height="170" fill="#000" opacity="0.55" />}
    </svg>
  );
}
