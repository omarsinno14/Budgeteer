import type { Config } from 'tailwindcss'


const config: Config = {
darkMode: 'class',
content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
theme: {
extend: {
colors: {
brand: {
50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 300: '#a5b4fc',
400: '#818cf8', 500: '#6366f1', 600: '#4f46e5', 700: '#4338ca', 800: '#3730a3', 900: '#312e81'
},
ink: {
50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1',
400: '#94a3b8', 500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1f2937', 900: '#0f172a'
}
},
boxShadow: {
soft: '0 10px 25px -10px rgba(2, 6, 23, 0.15)',
glass: 'inset 0 1px 0 0 rgba(255,255,255,0.15), 0 10px 30px -12px rgba(2,6,23,.35)'
},
borderRadius: { '3xl': '1.5rem' },
backgroundImage: {
grain: "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"100%\" height=\"100%\"><filter id=\"n\"><feTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"4\" stitchTiles=\"stitch\"/></filter><rect width=\"100%\" height=\"100\%\" filter=\"url(%23n)\" opacity=\"0.025\"/></svg>')",
radial: 'radial-gradient(1200px 600px at 20% -10%, rgba(99,102,241,.25), transparent), radial-gradient(1000px 500px at 110% 0%, rgba(67,56,202,.2), transparent)'
}
}
},
plugins: []
}
export default config