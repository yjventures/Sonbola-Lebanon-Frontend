/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // this is used as heavy weight font
        'teko': ['Teko'],
        // main is font_name we are calling and 'Public Sans' is font family which is used all over application
        'main': ['Public Sans'],
        // for new font, you need to import it in index.css from G.F -> put font family below
        'replace_by_main_and_see_the_magic': ['Barlow']
      },
      colors: {
        // background colors
        'header-background': '#222222',
        'footer-background': '#2B3445',
        // text color
        'primary-color': '#fff',
        'secondary-color': '#000',
        // text color
        'primary-text-color': '#fff',
        'secondary-text-color': '#000',
        // logo singup 
        'buttons': "#ED1C24",
        // category and motivation
        "primary-category": 'rgba(0, 166, 81, 0.3)',
        "primary-motivation": '#fff'

      }
    }
  },
  plugins: [
    // require('@tailwindcss/forms'),
  ],
}

