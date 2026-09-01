/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf7',
          100: '#d7f6ed',
          200: '#b1eedb',
          300: '#6ae0c6',
          400: '#38d4b0',
          500: '#29B896', // Exact TanovaX Logo Teal (#29B896)
          600: '#1fa082',
          700: '#17826a',
          800: '#105e4d',
          900: '#0a3c32',
          950: '#05201a',
        },
        dark: {
          bg: '#0A0F14',     // Deep sleek dark background
          card: '#111822',   // Premium dark card surface
          border: '#1E293B', // Subtle slate border
          muted: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
