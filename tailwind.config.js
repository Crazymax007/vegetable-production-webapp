/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      ss: "350px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      al: "1150px",
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
