/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dashboard: {
          bg: "#111827",       // main background
          card: "#1f2937",     // card surfaces
          border: "#374151",   // subtle borders
          text: "#f3f4f6",     // main text
          muted: "#9ca3af",    // secondary text
          primary: "#3b82f6",  // blue accents
          success: "#10b981",  // green for stock/good
          warning: "#f59e0b",  // amber for low stock
          danger: "#ef4444",   // red for errors
        },
      },
    },
  },
  plugins: [],
};
