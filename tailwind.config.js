/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#570df8',
        secondary: '#f000b8',
        accent: '#1F1C2E',
        neutral: '#FFFFFF',
        'base-100': '#F3F6FD',
        info: '#3abff8',
        success: '#36d399',
        warning: '#fbbd23',
        error: '#f87272'
      }
    }
  },
  plugins: []
};