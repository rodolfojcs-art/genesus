import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#09090f',
        surface: '#111118',
        surface2: '#1a1a26',
        surface3: '#222233',
        border: '#2a2a3d',
        accent: '#7c5cfc',
        'accent-2': '#00e5ff',
        'accent-3': '#ff6b6b',
        'accent-4': '#39ff14',
        gold: '#ffc800',
        neon: '#00ff88',
        electric: '#0066ff',
        amber: '#ffaa00',
        text: '#e8e8f0',
        muted: '#6b6b8a',
      },
      fontFamily: {
        sans: ['Syne', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 20px rgba(124,92,252,0.3)' },
          to: { boxShadow: '0 0 60px rgba(124,92,252,0.8)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
