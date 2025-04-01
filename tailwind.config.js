// import konstaConfig config
const konstaConfig = require('konsta/config');

// wrap config with konstaConfig config
module.exports = konstaConfig({
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/modules/**/*.{js,ts,jsx,tsx}'
  ],
  darkMode: 'class', // or 'class'
  theme: {
    extend: {
      colors: {
        primary: '#DAA520',
        'alt-light': '#F9F9F9',
        'alt-dark': '#373633',
        light: '#fff',
        dark: '#1E1E1E',
        danger: '#ff0000',
        border: '#CBC8C8'
      },
      scale: {
        'custom-small': '.4'
      }
    },
    screens: {
      sm: '640px',
      // => @media (min-width: 640px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '1024px',
      // => @media (min-width: 1024px) { ... }

      xl: '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }

      tvL: '1800px',

      // Min
      'cus-lg-min': '1500px',
      'cus-md2-min': '1200px',
      'cus-md3-min': '1001px',

      // Max
      'cus-xs': { max: '500px' },
      'cus-md': { max: '1300px' },
      'cus-md2': { max: '1150px' },
      'cus-md3': { max: '1000px' },
      'cus-lg': { max: '1500px' },
      'cus-lg2': { max: '850px' },
      'cus-sm': { max: '768px' },
      'cus-sm2': { max: '640px' },
      'cus-sm3': { max: '500px' }
    },
    fontFamily: {
      poppins: ['Poppins'],
      montserrat: ['Montserrat'],
      cursive: ['Grey Qo']
    }
  },
  variants: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')]
});
