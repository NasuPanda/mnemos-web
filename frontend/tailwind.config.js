/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          navy: '#1e3a5f',
          accent: '#2d5a87',
          light: '#4a90b8',
        },
        background: '#e8f0f5',
        warm: '#f5c842',
        dark: '#1a2e42',
      },
    },
  },
  plugins: [],
}