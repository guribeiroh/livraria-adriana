/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f7f5f2',  // Bege claro/off-white
          100: '#ede6db', // Bege claro
          200: '#e3d5c3', // Bege médio
          300: '#d3bea6', // Bege escuro
          400: '#c29e7a', // Marrom claro
          500: '#a0784c', // Marrom médio (cor principal)
          600: '#8c6239', // Marrom médio-escuro
          700: '#724e2e', // Marrom escuro
          800: '#5a3d23', // Marrom muito escuro
          900: '#432f1a', // Marrom quase preto
        },
        accent: {
          300: '#f1e7cb', // Dourado claro
          400: '#e9dcb7', // Dourado médio
          500: '#d4c28a', // Dourado principal
        },
        success: {
          100: '#e6f4ea',
          500: '#33a852',
          700: '#1e7e34',
        },
        error: {
          100: '#fdeded',
          500: '#ea4335',
          700: '#b31412',
        },
        background: '#f7f5f2', // Off-white (mostrado na paleta)
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Arial', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
        'hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}