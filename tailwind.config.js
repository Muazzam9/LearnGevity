/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: "#6a4cff",
          "deep-purple": "#4b2cff",
          navy: "#0b0f2f",
          blue: "#1b3cff",
          orange: "#ff9d00",
        },
      },
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fade-in 0.8s ease-out",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        pulse: "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.15" },
        },
      },
      boxShadow: {
        "3xl": "0 20px 50px -12px rgba(106, 76, 255, 0.4)",
      },
    },
  },
  plugins: [],
};
