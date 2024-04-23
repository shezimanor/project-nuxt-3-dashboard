import type { Config } from 'tailwindcss';

export default {
  content: [],
  theme: {
    extend: {
      height: {
        '128': '32rem'
      },
      gridTemplateColumns: {
        infolist: '84px 1fr'
      }
    }
  },
  plugins: []
} satisfies Config;
