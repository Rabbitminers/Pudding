/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'accent': 'var(--colour-accent)',
        'neutral': 'var(--colour-neutral)',
        'base': 'var(--colour-base)',
      },
    },
  },
  darkMode: 'class',
};