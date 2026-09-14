/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#333333',
          light: '#4A4A4A',
          dark: '#1F1F1F',
        },
        cream: {
          50: '#FDFCF5', // Main Background
          100: '#F9F7EC',
          200: '#F2EEDB',
          300: '#E6DFCA',
          400: '#D4C9B0',
          500: '#B8AB8F',
          600: '#9C8E73',
          700: '#7B6E57',
          800: '#5A503E',
          900: '#3A3327',
        },
        blush: {
          50: '#FFF7F9',
          100: '#FFDBE5', // Soft Highlight / Badges
          200: '#F7C4D0',
          300: '#EAA6B6',
          400: '#D97C90',
          500: '#B76E79', // Primary Brand Accent
          600: '#9E5862',
          700: '#83424C',
          800: '#673037',
          900: '#4D2026',
        },
        roseGold: {
          light: '#E8CCD1',
          DEFAULT: '#B76E79', // Primary Brand Accent
          dark: '#8C4D56',
        },
        sage: {
          50: '#F4F9F6',
          100: '#E4F0E9',
          200: '#CCE2D5',
          300: '#B2D3C0',
          DEFAULT: '#98C0A9', // Botanical Accent
          500: '#98C0A9',
          600: '#7BA68D',
          700: '#5B856D',
          800: '#406350',
          900: '#284235',
        },
        taupe: {
          50: '#FAF8F6',
          100: '#F2EFEA',
          200: '#E2DBD2',
          300: '#C7BCB0',
          DEFAULT: '#A69480', // Muted Supporting Tone
          500: '#A69480',
          600: '#8C7B68',
          700: '#736352',
          800: '#594C3E',
          900: '#40362C',
        },
        terracotta: {
          DEFAULT: '#B76E79',
          dark: '#8C4D56',
        },
        wine: {
          800: '#262626',
          900: '#333333', // Charcoal mapping for primary typography
          950: '#1A1A1A',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(51, 51, 51, 0.05), 0 2px 6px -1px rgba(183, 110, 121, 0.06)',
        'soft-lg': '0 10px 25px -3px rgba(51, 51, 51, 0.08), 0 4px 10px -2px rgba(183, 110, 121, 0.08)',
        'luxury': '0 20px 35px -5px rgba(51, 51, 51, 0.10), 0 10px 15px -5px rgba(166, 148, 128, 0.08)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'modal-pop': 'modalPop 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.32s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'heart-pop': 'heartPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'badge-bump': 'badgeBump 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        'shake': 'shake 0.35s ease-in-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        modalPop: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heartPop: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(0.8)' },
          '60%': { transform: 'scale(1.28)' },
          '100%': { transform: 'scale(1)' },
        },
        badgeBump: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.35)' },
          '100%': { transform: 'scale(1)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%, 60%': { transform: 'translateX(-4px)' },
          '40%, 80%': { transform: 'translateX(4px)' },
        },
      }
    },
  },
  plugins: [],
};
