import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      inset: {
        '1/8': '12.5%',
      },
      fontFamily: {
        "hina": "hina",
        "moon": "moon",
        "zen": "zen",
        "poly": "poly",
        "wapuro-mincho": "wapuro-mincho",
        "athelas": "athelas",
        "xano": "xano",
        'Hiragino Sans': "hiragino",
        "canterbury": "canterbury",
        "zapfino": "zapfino",
        "Hannari": "Hannari",
        "Verdana": "Verdana",
      },
      width: {
        'event': '38rem',
        'event-image': '44rem',
      },
      // カスタムスクリーン (縦幅対応)
      screens: {
        'mobile-landscape': { 'raw': '(max-height: 600px)' }, // 縦600px以下に適用
        'tablet-portrait': { 'raw': '(min-height: 768px) and (max-width: 1024px)' }, // 縦900px以下に適用
      },
    },
  },
  plugins: [],
}

export default config;
