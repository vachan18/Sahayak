/** @type {import('tailwindcss').Config} */

// ─────────────────────────────────────────────────────────────────────────────
// AANGAN DESIGN LANGUAGE — Sahayak
// Every colour is a CSS variable (RGB channels) so light / dark / sunlight
// themes swap at runtime without re-rendering, and Tailwind alpha still works.
// ─────────────────────────────────────────────────────────────────────────────
const token = (name) => `rgb(var(--c-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', 'html.dark'],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        // Surfaces
        paper: token('paper'),        // app canvas (khadi paper)
        surface: token('surface'),    // cards, sheets
        sunken: token('sunken'),      // wells, inputs, inactive tracks
        line: token('line'),          // hairlines
        'line-strong': token('line-strong'),
        // Text
        ink: token('ink'),
        'ink-2': token('ink-2'),
        'ink-3': token('ink-3'),
        'on-neel': token('on-neel'),
        'on-hero': token('on-hero'),
        hero: { neel: token('hero-neel'), patti: token('hero-patti') },
        // Brand
        neel: { DEFAULT: token('neel'), deep: token('neel-deep'), tint: token('neel-tint'), ink: token('neel-ink') },
        haldi: { DEFAULT: token('haldi'), deep: token('haldi-deep'), tint: token('haldi-tint') },
        // Semantics
        patti: { DEFAULT: token('patti'), tint: token('patti-tint') },     // success / eligible
        kesar: { DEFAULT: token('kesar'), tint: token('kesar-tint') },     // attention / verify
        sindoor: { DEFAULT: token('sindoor'), tint: token('sindoor-tint') }, // error / fraud
        // Life-event hues (each pairs with an icon so colour is never the only cue)
        khet: { DEFAULT: token('khet'), tint: token('khet-tint') },         // farming
        sehat: { DEFAULT: token('sehat'), tint: token('sehat-tint') },      // health & elders
        mamta: { DEFAULT: token('mamta'), tint: token('mamta-tint') },      // women & child
        vidya: { DEFAULT: token('vidya'), tint: token('vidya-tint') },      // education
        kaarigar: { DEFAULT: token('kaarigar'), tint: token('kaarigar-tint') }, // business & artisans
        ghar: { DEFAULT: token('ghar'), tint: token('ghar-tint') },         // housing
      },
      fontFamily: {
        // `--font-script` is swapped per language on <html>; Latin numerals always use Plus Jakarta Sans.
        // Latin first so numerals & brand names stay in one consistent voice; Indic glyphs
        // fall through to the script-matched Noto Sans family set in `--font-script`.
        sans: ['"Plus Jakarta Sans"', 'var(--font-script)', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'var(--font-script)', 'system-ui', 'sans-serif'],
        num: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Fluid, rem-based (scales with the user's text-size preference)
        micro: ['0.8125rem', { lineHeight: '1.35' }],
        small: ['0.9375rem', { lineHeight: '1.45' }],
        body: ['1.0625rem', { lineHeight: '1.55' }],
        lead: ['1.1875rem', { lineHeight: '1.5' }],
        h3: ['1.3125rem', { lineHeight: '1.25' }],
        h2: ['clamp(1.5rem, 1.2rem + 1.2vw, 2rem)', { lineHeight: '1.15' }],
        h1: ['clamp(1.875rem, 1.4rem + 2vw, 2.875rem)', { lineHeight: '1.08' }],
        display: ['clamp(2.5rem, 1.6rem + 4vw, 4.5rem)', { lineHeight: '1' }],
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '12px',
        lg: '16px',
        xl: '22px',
      },
      boxShadow: {
        hair: '0 0 0 1px rgb(var(--c-line))',
        lift: '0 1px 0 rgb(var(--c-line)), 0 10px 28px -14px rgb(var(--c-shadow) / 0.28)',
        float: '0 24px 60px -20px rgb(var(--c-shadow) / 0.38), 0 0 0 1px rgb(var(--c-line))',
        press: 'inset 0 2px 0 rgb(var(--c-shadow) / 0.12)',
        dock: '0 -1px 0 rgb(var(--c-line)), 0 -12px 32px -18px rgb(var(--c-shadow) / 0.3)',
      },
      transitionTimingFunction: {
        out: 'cubic-bezier(0.2, 0, 0, 1)',
        in: 'cubic-bezier(0.3, 0, 1, 1)',
        spring: 'cubic-bezier(0.34, 1.4, 0.64, 1)',
      },
      transitionDuration: {
        micro: '120ms',
        short: '200ms',
        medium: '320ms',
      },
      keyframes: {
        'ring-out': {
          '0%': { transform: 'scale(1)', opacity: '0.5' },
          '100%': { transform: 'scale(1.9)', opacity: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'ring-out': 'ring-out 1.8s cubic-bezier(0.2, 0, 0, 1) infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        'fade-up': 'fade-up 320ms cubic-bezier(0.2, 0, 0, 1) both',
      },
    },
  },
  plugins: [],
};
