/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#08090D',
        'background-secondary': '#0D0F15',
        surface: '#10121A',
        'surface-hover': '#171A24',
        primary: {
          DEFAULT: '#8B5CF6',
          hover: '#9D74FF',
          dark: '#7039ED',
        },
        secondary: {
          DEFAULT: '#C4FF3D',
          hover: '#D4FF66',
        },
        'text-primary': '#F5F5F5',
        'text-secondary': '#B4B6C0',
        'text-muted': '#858895',
      },
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.12)',
        subtle: 'rgba(255, 255, 255, 0.08)',
        strong: 'rgba(255, 255, 255, 0.2)',
      },
      backgroundColor: {
        glass: 'rgba(255, 255, 255, 0.05)',
        'glass-hover': 'rgba(255, 255, 255, 0.08)',
      },
      boxShadow: {
        'glow-purple': '0 0 40px -10px rgba(139, 92, 246, 0.35)',
        'glow-purple-lg': '0 0 70px -10px rgba(139, 92, 246, 0.5)',
        'glow-lime': '0 0 30px -8px rgba(196, 255, 61, 0.3)',
        'inner-glow': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
        'shell': '0 25px 70px -15px rgba(0, 0, 0, 0.8), 0 0 50px -10px rgba(139, 92, 246, 0.15)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        display: ['Outfit', 'Syne', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        'float-slow': 'floatSlow 7s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}
