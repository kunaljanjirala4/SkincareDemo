/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.html",
      "./src/**/*.js",
    ],
    theme: {
      extend: {
        colors: {
          skin: {
            light: "#FFF0F3",
            DEFAULT: "#F472B6",
            dark: "#BE185D"
          }
        }
      },
    },
    plugins: [],
  };
  