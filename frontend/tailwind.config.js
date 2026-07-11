/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        mine: {
          bg: '#050B18',
          card: '#0D1B2A',
          cardHover: '#1B263B',
          cyan: '#00D4FF',
          amber: '#FFB800',
          red: '#FF3B30',
          green: '#00E676',
          textMuted: '#8BA5BC',
          textLight: '#E8F4FD',
          border: 'rgba(0, 212, 255, 0.15)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glowCyan: '0 0 15px rgba(0, 212, 255, 0.3)',
        glowRed: '0 0 15px rgba(255, 59, 48, 0.3)',
        glowGreen: '0 0 15px rgba(0, 230, 118, 0.3)',
        glowAmber: '0 0 15px rgba(255, 184, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
