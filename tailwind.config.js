/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      mbTest: "100px",
    },
    extend: {
      colors: {
        "Green-Custom": "#c8e29c",
        "Green-button": "#218F33",
        "white-notReal": "f9fafb",
      },
      fontSize: {
        xl: "20px",
      },
    },
  },
  plugins: [],
};
