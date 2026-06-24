import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#090a0d",
        smoke: "#17191f",
        bone: "#f2eadf",
        rain: "#6fd1d5",
        ember: "#f5a524",
        signal: "#ff4f87",
        moss: "#78d487",
      },
      boxShadow: {
        glow: "0 0 34px rgba(111, 209, 213, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
