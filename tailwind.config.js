/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
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
