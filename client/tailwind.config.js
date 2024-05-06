/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // ...
  ],
    theme: {
      extend: {
        colors: {
          'custom-green1': '#84a98c',
          'custom-green2': '#354f52',
          'custom-green3': '#cad2c5',
          'custom-green4': '#2f3e46',
          'custom-green5': '#0b2545',
          // You can add more custom colors here
        },
      },
    },
     
}