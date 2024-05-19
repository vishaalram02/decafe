import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F3E9DC",
        cafe1: "#F3E9DC",
        cafe2: "#C08552",
        cafe3: "#895737",
        cafe4: "#DAB49D",
      },
      fontFamily: {
        mabry: ["mabry"],
      },
    },
  },
  plugins: [],
};
export default config;
