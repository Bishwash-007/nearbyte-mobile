/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins-Regular'],
        'poppins-thin': ['Poppins-Thin'],
        'poppins-thin-italic': ['Poppins-ThinItalic'],
        'poppins-extralight': ['Poppins-ExtraLight'],
        'poppins-extralight-italic': ['Poppins-ExtraLightItalic'],
        'poppins-light': ['Poppins-Light'],
        'poppins-light-italic': ['Poppins-LightItalic'],
        'poppins-italic': ['Poppins-Italic'],
        'poppins-medium': ['Poppins-Medium'],
        'poppins-medium-italic': ['Poppins-MediumItalic'],
        'poppins-semibold': ['Poppins-SemiBold'],
        'poppins-semibold-italic': ['Poppins-SemiBoldItalic'],
        'poppins-bold': ['Poppins-Bold'],
        'poppins-bold-italic': ['Poppins-BoldItalic'],
        'poppins-extrabold': ['Poppins-ExtraBold'],
        'poppins-extrabold-italic': ['Poppins-ExtraBoldItalic'],
        'poppins-black': ['Poppins-Black'],
        'poppins-black-italic': ['Poppins-BlackItalic'],
      },
    },
  },
  plugins: [],
};
