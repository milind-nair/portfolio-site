/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0f172a',
        accent: '#2a5599',
        accentWarm: '#f50057',
        mist: '#e2e8f0',
      },
      boxShadow: {
        panel: '0 20px 60px rgba(15, 23, 42, 0.14)',
      },
      maxWidth: {
        prose: '72ch',
      },
    },
  },
  plugins: [],
};
