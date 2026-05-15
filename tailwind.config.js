/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
    "./utils/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#121212',
        surfaceHighlight: '#1E1E1E',
        gold: {
          400: '#D4B06A',
          500: '#C5A059',
          600: '#A68545',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
        header: ['Outfit', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 1s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-left': 'fadeInLeft 0.8s ease-out forwards',
        'fade-in-right': 'fadeInRight 0.8s ease-out forwards',
        'subtle-zoom': 'subtleZoom 20s infinite alternate',
        'float-up': 'floatUp 15s linear infinite',
        'fall-down': 'fallDown 10s linear infinite',
        'sway': 'sway 3s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        fadeInUp: { '0%': { opacity: '0', transform: 'translateY(30px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeInLeft: { '0%': { opacity: '0', transform: 'translateX(-30px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        fadeInRight: { '0%': { opacity: '0', transform: 'translateX(30px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        subtleZoom: { '0%': { transform: 'scale(1)' }, '100%': { transform: 'scale(1.1)' } },
        floatUp: { 
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' }, 
          '10%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-20vh) rotate(360deg)', opacity: '0' } 
        },
        fallDown: { 
          '0%': { transform: 'translateY(-20vh) rotate(0deg)', opacity: '0.8' }, 
          '100%': { transform: 'translateY(100vh) rotate(360deg)', opacity: '0.2' } 
        },
        sway: {
          '0%': { transform: 'rotate(-5deg)' },
          '100%': { transform: 'rotate(5deg)' }
        }
      }
    }
  },
  plugins: [],
}
