/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0e0e11',
        panel: '#151518',
        border: '#27272a',
        primary: '#7c3aed',
        primaryHover: '#6d28d9',
        textPrimary: '#f4f4f5',
        textSecondary: '#a1a1aa'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
