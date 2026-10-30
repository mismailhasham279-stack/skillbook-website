/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#06090F',
          900: '#0B0F17',
          800: '#0F141F',
        },
        cyan: {
          DEFAULT: '#06B6D4',
          bright: '#22D3EE',
        },
        emerald: '#10B981',
      },
    },
  },
  plugins: [],
}
