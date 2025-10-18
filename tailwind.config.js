/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e293b',
        'primary-dark': '#0f172a',
        accent: '#06d6a0',
        'accent-light': '#4ade80',
        'text-primary': '#f8fafc',
        'text-secondary': '#94a3b8'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 400ms ease-in'
      }
    }
  },
  plugins: []
}
