/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0',
          800: '#1e293b', 900: '#0f172a', 950: '#020617'
        },
        indigo: {
          50: '#eef2ff', 100: '#e0e7ff',
          500: '#6366f1', 600: '#4f46e5', 700: '#4338ca'
        },
        emerald: { 500: '#10b981' }
      },
      fontFamily: { sans: ['Inter', 'system-ui', 'sans-serif'] },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        },
        pulseRed: {
          '0%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.7)' },
          '70%': { boxShadow: '0 0 0 15px rgba(239,68,68,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-in-out',
        pulseRed: 'pulseRed 1.5s infinite'
      }
    }
  },
  plugins: []
}
