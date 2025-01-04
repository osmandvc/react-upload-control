const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./src/stories/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      height: {
        /* screen fix required for Android/Chrome since viewport calculated differently */
        screen: ["100vh /* fallback for Opera, IE and etc. */", "100dvh"],
      },
      colors: {
        primary: "#0891b2",
      },
      screens: {
        xs: "410px",
        // => @media (min-width: 420px) { ... }
        ...defaultTheme.screens,
        xsh: {
          raw: "(min-height: 480px)",
        },
        smh: {
          raw: "(min-height: 760px)",
        },
        mdh: {
          raw: "(min-height: 1024px)",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar")],
};
