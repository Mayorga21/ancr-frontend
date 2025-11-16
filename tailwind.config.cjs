module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ancrBlue: "#0A2342",      // azul institucional
        ancrBlueLight: "#12355B", // azul un poco más claro
        ancrGold: "#F6A623",      // naranja/dorado
        ancrBg: "#F3F4F6",        // fondo gris muy claro
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
