/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom breakpoints matching our responsive design spec
      screens: {
        'xs': '475px',   // Extra small (large phones)
        'sm': '640px',   // Small tablets and large phones  
        'md': '768px',   // Tablets
        'lg': '1024px',  // Laptops and desktops
        'xl': '1280px',  // Large desktops
        '2xl': '1536px', // Extra large screens
        // Custom breakpoints for our specific needs
        'mobile': {'max': '767px'},    // Mobile-only styles
        'tablet': {'min': '768px', 'max': '1023px'}, // Tablet-only styles
        'desktop': {'min': '1024px'},  // Desktop and above
      },
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
      // Custom spacing scale for touch targets
      spacing: {
        '11': '2.75rem',   // 44px - minimum touch target
        '12': '3rem',      // 48px - recommended touch target
        '14': '3.5rem',    // 56px - large touch target
      },
      // Custom font sizes for responsive typography
      fontSize: {
        'mobile-xs': ['12px', '1.4'],
        'mobile-sm': ['14px', '1.4'],
        'mobile-base': ['16px', '1.5'],
        'mobile-lg': ['18px', '1.4'],
        'mobile-xl': ['20px', '1.3'],
      },
      // Touch-friendly minimum dimensions
      minWidth: {
        'touch': '44px',
        'touch-lg': '48px',
      },
      minHeight: {
        'touch': '44px',
        'touch-lg': '48px',
      },
    },
  },
  plugins: [],
}