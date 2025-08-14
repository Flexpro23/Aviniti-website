/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New Brand Colors
        'slate-blue': {
          50: '#f1f3f6',
          100: '#e1e6ec',
          200: '#c6cfdc',
          300: '#9fb0c4',
          400: '#708aa6',
          500: '#556b8b',
          600: '#35465d', // Primary brand color
          700: '#2d3a4d',
          800: '#283041',
          900: '#252a37',
          dark: '#1e293b', // Additional dark variant
        },
        'bronze': {
          50: '#faf8f6',
          100: '#f4f0ec',
          200: '#e8ddd6',
          300: '#d8c4b5',
          400: '#c5a28e',
          500: '#c08460', // Primary brand color
          600: '#a6714e',
          700: '#8a5d42',
          800: '#724e39',
          900: '#5e4131',
        },
        'off-white': '#f4f4f2',
        
        // Update existing primary/secondary to use new brand colors
        primary: {
          50: '#f1f3f6',
          100: '#e1e6ec',
          200: '#c6cfdc',
          300: '#9fb0c4',
          400: '#708aa6',
          500: '#556b8b',
          600: '#35465d',
          700: '#2d3a4d',
          800: '#283041',
          900: '#252a37',
        },
        secondary: {
          50: '#faf8f6',
          100: '#f4f0ec',
          200: '#e8ddd6',
          300: '#d8c4b5',
          400: '#c5a28e',
          500: '#c08460',
          600: '#a6714e',
          700: '#8a5d42',
          800: '#724e39',
          900: '#5e4131',
        },
        neutral: {
          50: '#f4f4f2', // off-white
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
        'spin-slow-reverse': 'spin-slow-reverse 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'spin-slow': {
          from: { transform: 'translate(-50%, -50%) rotate(0deg)' },
          to: { transform: 'translate(-50%, -50%) rotate(360deg)' },
        },
        'spin-slow-reverse': {
          from: { transform: 'translate(-50%, -50%) rotate(360deg)' },
          to: { transform: 'translate(-50%, -50%) rotate(0deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right bottom, var(--primary-600), var(--primary-800))',
        'gradient-secondary': 'linear-gradient(to right bottom, var(--secondary-400), var(--secondary-600))',
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
} 