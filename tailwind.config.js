// eslint-disable-next-line import/no-anonymous-default-export
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      zIndex: {
        '70': '70',
        '80': '80',
      },
    },
  },
  plugins: [],
}