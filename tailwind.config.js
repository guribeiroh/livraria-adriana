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
          50: '#f5f3f0',  // Bege claro/off-white
          100: '#e8ddcf', // Bege claro
          200: '#dbc8b6', // Bege médio
          300: '#c6a88c', // Bege escuro
          400: '#b08b6a', // Marrom claro
          500: '#8e6141', // Marrom médio (mostrado na paleta)
          600: '#784d32', // Marrom médio-escuro
          700: '#633e29', // Marrom escuro
          800: '#4e2f1e', // Marrom muito escuro
          900: '#392214', // Marrom quase preto
        },
        accent: '#e9dcb7',  // Bege amarelado/dourado claro (mostrado na paleta)
        background: '#f5f3f0', // Off-white (mostrado na paleta)
      },
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}