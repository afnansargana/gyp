/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        ink: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
        accent: {
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
        display: ['"Outfit"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 23, 42, 0.12)",
        glass: "0 8px 32px rgba(2, 6, 23, 0.35)",
        lift: "0 12px 40px -8px rgba(6, 182, 212, 0.35)",
        neu: "6px 6px 16px rgba(2, 6, 23, 0.45), -4px -4px 12px rgba(30, 41, 59, 0.4)",
      },
      backgroundImage: {
        "mesh-dark":
          "radial-gradient(at 20% 20%, rgba(6,182,212,0.15) 0, transparent 50%), radial-gradient(at 80% 0%, rgba(16,185,129,0.1) 0, transparent 40%), linear-gradient(180deg, #020617 0%, #0f172a 100%)",
        "mesh-light":
          "radial-gradient(at 10% 0%, rgba(6,182,212,0.08) 0, transparent 45%), radial-gradient(at 90% 10%, rgba(16,185,129,0.06) 0, transparent 40%), linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)",
      },
      keyframes: {
        "otp-pop": {
          "0%": { transform: "scale(0.6)", opacity: "0" },
          "60%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "20%, 60%": { transform: "translateX(-6px)" },
          "40%, 80%": { transform: "translateX(6px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "otp-pop": "otp-pop 0.22s ease-out",
        shake: "shake 0.4s ease-in-out",
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "fade-up": "fade-up 0.4s ease-out",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};
