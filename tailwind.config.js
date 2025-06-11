/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tines-blue': '#0066cc',
        'tines-gray': '#f8f9fa',
        'tines-border': '#e1e5e9',
      }
    },
  },
  plugins: [],
} 