export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F8F6F2",
        paperSoft: "#F3EFE8",
        ink: "#1E1E1E",
        inkSoft: "#6B6B6B",
        inkMuted: "#9A9A9A",
        accent: "#2F5D50",
        accentHover: "#244A40",
        gold: "#C9A24D",
        borderSoft: "#E5E1DA",
      },
      keyframes: {
        ripple: {
          "0%": {
            transform: "scale(0)",
            opacity: "1",
          },
          "100%": {
            transform: "scale(4)",
            opacity: "0",
          },
        },
      },
      animation: {
        ripple: "ripple 0.6s ease-out",
      },
    },
  },
  plugins: [],
}
