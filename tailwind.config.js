/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ma: {
          bg: 'var(--ma-bg)',
          surface: 'var(--ma-surface)',
          elevated: 'var(--ma-elevated)',
          ink: 'var(--ma-ink)',
          muted: 'var(--ma-muted)',
          line: 'var(--ma-line)',
          graphite: 'var(--ma-graphite)',
          charcoal: 'var(--ma-charcoal)',
          gold: 'var(--ma-gold)',
          'gold-dim': 'var(--ma-gold-dim)',
          teal: 'var(--ma-teal)',
          'teal-muted': 'var(--ma-teal-muted)',
          'amber-warn': 'var(--ma-amber-warn)',
          risk: 'var(--ma-risk)',
        },
      },
    },
  },
  plugins: [],
}
