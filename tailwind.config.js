/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        auth : "#EFCC00",
        form : "#EBE0AB",
        txt : "#9B881C",
        button : "#FFF306",
        button2 : "#E2D600",
        line : "#B7B7B7",
        txtNav : "#5B5B5B",
        card : "#F6F6F6",
        iconBG : "#D9D9D9",
        cardBG : "#DFDFDF",
        pen : "#0D00FF",
        trash : "#FF0000",
        buttonBlue : "#146ADC "
      },
      fontFamily: {
        'prociono' : ['serif', 'sans-serif'],
        'poppins':   ['Poppins', 'serif'],
        'inter' : ['Inter', 'sans-serif'],
        'prompt' : ['Prompt', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

