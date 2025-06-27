/** @type {import('tailwindcss').Config} */
module.exports = {
  mode:'jit',
  corePlugins:{
    container: false
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {

    extend: {
      fontFamily: {
        'sans': ['Manrope', 'sans-serif']
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

        zIndex: {
          '-1000': '-1000',
        },
        screens: {
          '3xl': '2050px',
          '4k': '3840px',
          '2k': '2560px',
        },


    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.placeholder-left::placeholder': {
          'text-align': 'left',
        },
      });
    },
  ],
};