/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // MINDS Inclusive Design Palette (v2.0)
        minds: {
          cream: '#FFF9F5',
          coral: '#E8505B',
          teal: '#14A085',
          amber: '#F9A826',
          charcoal: '#2D3436',
          gray: '#636E72',
          white: '#FFFFFF',
          success: '#27AE60',
          border: '#E8E8E8',
        },
        // Primary color scale (coral tones)
        primary: {
          50: '#FFF5F5',
          100: '#FFE8E9',
          200: '#FFCCCF',
          300: '#FFA8AD',
          400: '#F07580',
          500: '#E8505B',
          600: '#D03A45',
          700: '#B02835',
          800: '#901D28',
          900: '#701520',
        },
        // Secondary color scale (teal tones)
        secondary: {
          50: '#F0FDF9',
          100: '#CCFBEF',
          200: '#99F6DF',
          300: '#5EEAD8',
          400: '#2DD4C0',
          500: '#14A085',
          600: '#0D8A73',
          700: '#0A6F5E',
          800: '#085A4D',
          900: '#064A40',
        },
        // Legacy palettes (kept for backwards compatibility)
        // Person 3: Volunteer Swiper - Warm coral/salmon palette
        coral: {
          50: '#fff5f3',
          100: '#ffe8e3',
          200: '#ffd4cb',
          300: '#ffb3a3',
          400: '#ff8a73',
          500: '#ff6b4a',
          600: '#f04d2e',
          700: '#c93d21',
          800: '#a5351f',
          900: '#88321f',
        },
        sage: {
          50: '#f4f9f4',
          100: '#e6f2e6',
          200: '#cee5cf',
          300: '#a7d0a9',
          400: '#78b37c',
          500: '#56965a',
          600: '#437a47',
          700: '#38623b',
          800: '#304f32',
          900: '#28412b',
        },
        // Person 4: Staff Analytics - Deep indigo with warm gold
        navy: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a4b8fc',
          400: '#8093f8',
          500: '#6271f1',
          600: '#4a4de5',
          700: '#3d3dca',
          800: '#3435a3',
          900: '#1e1b4b',
          950: '#0f0d2e',
        },
        gold: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#d4a106',
          600: '#b88c03',
          700: '#926b07',
          800: '#78560d',
          900: '#654711',
        },
      },
      fontFamily: {
        // MINDS Inclusive Design fonts (v2.0)
        display: ['Nunito', 'system-ui', 'sans-serif'],
        sans: ['DM Sans', 'system-ui', 'sans-serif'],
        // Legacy fonts (kept for backwards compatibility)
        accent: ['Bricolage Grotesque', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow-coral': '0 0 40px -10px rgba(255, 107, 74, 0.4)',
        'glow-sage': '0 0 40px -10px rgba(86, 150, 90, 0.4)',
        'glow-gold': '0 0 40px -10px rgba(212, 161, 6, 0.3)',
        'card-hover': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'inner-glow': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-coral': 'radial-gradient(at 40% 20%, rgba(255, 107, 74, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(120, 179, 124, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(255, 138, 115, 0.1) 0px, transparent 50%)',
        'mesh-navy': 'radial-gradient(at 0% 0%, rgba(98, 113, 241, 0.08) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(212, 161, 6, 0.06) 0px, transparent 50%), radial-gradient(at 50% 100%, rgba(30, 27, 75, 0.04) 0px, transparent 50%)',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-soft': 'bounce-soft 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'bounce-soft': {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.02)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}
