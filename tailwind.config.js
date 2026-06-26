/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Surfaces
        base: 'var(--color-base)',
        surface: 'var(--color-surface)',
        raised: 'var(--color-raised)',
        // Ink
        ink: 'var(--color-ink)',
        'ink-muted': 'var(--color-ink-muted)',
        // Accents: gold (primary) + jade (secondary) + iris (amethyst "Tử Vi" star)
        gold: 'var(--color-gold)',
        jade: 'var(--color-jade)',
        iris: 'var(--color-iris)',
        // Ngu hanh (Five Elements)
        kim: 'var(--color-kim)',
        moc: 'var(--color-moc)',
        thuy: 'var(--color-thuy)',
        hoa: 'var(--color-hoa)',
        tho: 'var(--color-tho)',
        // State
        good: 'var(--color-good)',
        warn: 'var(--color-warn)',
        bad: 'var(--color-bad)',
      },
      fontFamily: {
        display: ['"Noto Serif"', 'Georgia', 'serif'],
        sans: ['"Be Vietnam Pro"', 'system-ui', 'sans-serif'],
        mono: ['"Be Vietnam Pro"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // type scale 12/14/16/20/28/40 (xs/sm/base/xl already match)
        '2xs': ['0.6875rem', { lineHeight: '1rem' }], // 11px dense data labels
        'h2': ['1.75rem', { lineHeight: '2.125rem' }], // 28
        'h1': ['2.5rem', { lineHeight: '2.875rem' }],  // 40
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        raised: 'var(--shadow-raised)',
        glow: 'var(--shadow-glow)',
      },
    },
  },
  plugins: [],
}
