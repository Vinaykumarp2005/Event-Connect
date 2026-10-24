// tailwind.config.js

// Theme-aware colours: `white` is the foreground ink and `black` the page colour.
// They (and the neutral scale) swap in light mode via CSS variables in index.css,
// so classes like text-white / bg-white/10 / text-neutral-400 work in both themes.
const v = (name) => `rgb(var(${name}) / <alpha-value>)`;

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: "#0f172a",
        white: v("--c-white"),
        black: v("--c-black"),
        neutral: {
          50: v("--c-n50"),
          100: v("--c-n100"),
          200: v("--c-n200"),
          300: v("--c-n300"),
          400: v("--c-n400"),
          500: v("--c-n500"),
          600: v("--c-n600"),
          700: v("--c-n700"),
          800: v("--c-n800"),
          900: v("--c-n900"),
          950: v("--c-n950"),
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", '"SF Pro Display"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}
