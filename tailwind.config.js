/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors:{
        'custom-green': '#537e7c',
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
}
