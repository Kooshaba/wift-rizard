/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        pixel: "CraftPix, monospace",
      },
      aria: {
        busy: 'busy="true"',
      },
      cursor: {
        hover: `url("assets/cursor-outline.png"), pointer`
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
};
