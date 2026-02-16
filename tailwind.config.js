/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quest: {
          dark: '#0b1120',
          panel: '#1e293b',
          gold: '#fbbf24',
          success: '#22c55e',
          danger: '#ef4444',
          info: '#3b82f6'
        }
      }
    },
  },
  plugins: [],
}