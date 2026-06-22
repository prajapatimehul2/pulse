import type { Config } from "tailwindcss";

// Dark-first design system inspired by virlo.ai — deep slate canvas,
// gradient accents (violet → fuchsia), generous radii, soft borders.
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0a0a0f",
        surface: "#13131c",
        "surface-2": "#1b1b27",
        border: "#262633",
        muted: "#8b8ba7",
        foreground: "#ececf1",
        accent: {
          DEFAULT: "#8b5cf6",
          violet: "#8b5cf6",
          fuchsia: "#d946ef",
          cyan: "#22d3ee",
        },
        habit: {
          water: "#22d3ee",
          sleep: "#8b5cf6",
          workout: "#f59e0b",
          medication: "#34d399",
        },
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)",
        "glow-radial":
          "radial-gradient(60% 60% at 50% 0%, rgba(139,92,246,0.18) 0%, rgba(10,10,15,0) 100%)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.35s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
