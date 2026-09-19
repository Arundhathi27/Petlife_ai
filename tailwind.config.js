/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFDF9',
          100: '#FAF7F2',
          200: '#F5EFE6',
          300: '#EADFCF',
        },
        pet: {
          teal: '#14B8A6',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
          purple: '#8B5CF6',
          indigo: '#6366F1',
          cream: '#FAF7F2',
          slate: '#334155',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(120, 80, 40, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 10px 30px -5px rgba(180, 140, 90, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.03)',
        'glow': '0 0 20px rgba(16, 185, 129, 0.2)',
      },
    },
  },
  plugins: [],
};
