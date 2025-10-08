import daisyui from 'daisyui'

export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: [daisyui],
  daisyui: {
    themes: [
      'light',
      'dark',
      'cupcake',
      'dracula',
      {
        pruna: {
          'primary': '#7ee7ff',
          'primary-content': '#001f2d',
          'secondary': '#ffd580',
          'accent': '#7ee7ff',
          'neutral': '#071424',
          'base-100': '#0b1216',
          'info': '#66d3ff',
          'success': '#9fffb3',
          'warning': '#ffdd57',
          'error': '#ff6b6b',
        }
      }
    ]
  }
};
