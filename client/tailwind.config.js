/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'Arial'],
      },
      colors: {
        primary: '#0ea5e9', // sky-500
        accent: '#22d3ee',  // cyan-400
      },
      boxShadow: {
        card: '0 10px 30px rgba(15, 23, 42, 0.08)',
      }
    }
  },
  plugins: [require('@tailwindcss/forms')],
}
