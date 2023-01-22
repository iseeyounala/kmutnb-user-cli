/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './screens/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        orange_new: '#FAE2D6',
        gray_new: '#808080',
        green_new: '#1DAE46',
        bule_new: '#55ADFF',
        orange_intense: '#FFB45C',
        orange_theme: '#F37234',
      },
      // fontFamily: {
      //   sans: ['Kanit-Medium'],
      // },
    },
    fontFamily: {
      kanit_bold: ['Kanit-Bold'],
      kanit_semi_bold: ['Kanit-SemiBold'],
      kanit_light: ['Kanit-Light'],
      kanit_regular: ['Kanit-Regular'],
    },
    fontSize: {
      // sm: ['14px', '20px'],
      base: ['15px', '24px'],
      lg: ['18px', '28px'],
      // xl: ['24px', '32px'],
    },
  },
  plugins: [],
};
