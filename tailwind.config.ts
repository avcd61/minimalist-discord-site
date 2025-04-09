import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        montserrat: ["Montserrat", "sans-serif"],
        kanit: ["var(--font-kanit)"],
        serif: ["Playfair Display", "serif"],
        mono: ["Roboto Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
        western: ["Rye", "serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        vintage: {
          paper: "#f5f0e1",
          hearts: "#a12d2b",
          diamonds: "#a12d2b",
          clubs: "#2c2c2c",
          spades: "#2c2c2c",
          border: "#d3c7a7",
          stain: "#d3bc8d",
          text: "#4a3f35",
        },
        western: {
          paper: "#F5E9D0",
          gold: "#B38B30",
          brown: "#5D3A18",
          border: "#5D3A18",
          hearts: "#BF0000",
          diamonds: "#BF0000",
          clubs: "#000000",
          spades: "#000000",
          primary: "#3c2b1a",
          secondary: "#5c4731",
          sand: "#d3bc8d",
          leather: "#8c6e42",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "paper-reveal": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "rotate-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "card-flip": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        "fadeIn": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fadeOut": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(-10px)" },
        },
        "levitate": {
          "0%, 100%": {
            transform: "translateY(0)",
          },
          "50%": {
            transform: "translateY(-10px)",
          },
        },
        "ripple": {
          "0%": {
            width: "0px", 
            height: "0px", 
            opacity: "0.5",
            transform: "translate(-50%, -50%) scale(0)"
          },
          "100%": {
            width: "500px", 
            height: "500px", 
            opacity: "0",
            transform: "translate(-50%, -50%) scale(1)"
          }
        },
        "pulse": {
          "0%, 100%": {
            opacity: "1",
            transform: "scale(1)"
          },
          "50%": {
            opacity: "0.8",
            transform: "scale(1.05)"
          }
        },
        "shimmer": {
          "0%": {
            backgroundPosition: "-1000px 0",
          },
          "100%": {
            backgroundPosition: "1000px 0",
          },
        },
        tumbleweed: {
          "0%": { transform: "translateX(-100%) rotate(0deg)" },
          "100%": { transform: "translateX(100vw) rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        float: "float 6s ease-in-out infinite",
        "paper-reveal": "paper-reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "rotate-slow": "rotate-slow 20s linear infinite",
        "card-flip": "card-flip 0.5s cubic-bezier(0.455, 0.03, 0.515, 0.955) forwards",
        "fadeIn": "fadeIn 0.4s ease-out forwards",
        "fadeOut": "fadeOut 0.4s ease-in forwards",
        "levitate": "levitate 3s ease-in-out infinite",
        "ripple": "ripple 1s linear forwards",
        "pulse": "pulse 2s ease-in-out infinite",
        "shimmer": "shimmer 2s infinite linear",
        tumbleweed: "tumbleweed 15s linear",
      },
      backgroundImage: {
        "paper-texture": "url('/textures/paper-texture.png')",
        "card-overlay": "url('/textures/card-overlay.png')",
        "noise-pattern": "url('/textures/noise.png')",
        "western-texture": "url('/textures/western-texture.png')",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
