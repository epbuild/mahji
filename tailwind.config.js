/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cherry: { DEFAULT: '#E03050', light: '#E8566D' },
        lavender: { hint: '#F5F2F9', soft: '#ECE7F3', DEFAULT: '#C0B2D4', mid: '#A898BE', deep: '#7E64A4', text: '#9688AA' },
        cerulean: { DEFAULT: '#8EC7E2', pale: '#D9ECF5', paleLt: '#EDF5FA' },
        seafoam: { DEFAULT: '#6DBFA8', light: 'rgba(118,195,170,0.3)' },
        coffee: { DEFAULT: '#4A3D32', light: '#65554a' },
        mahji: { dark: '#302040', mid: '#5E4D6D', light: '#9A8DAA' },
      },
      fontFamily: {
        display: ['"Bodoni Moda"', 'serif'],
        body: ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
