/**
 * @type {import('tailwindcss').Config}
 */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  // Enables dark mode support with class based detection (`class` key)
  darkMode: 'class',

  // Specifies the paths to your application files for content scanning
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],

  theme: {
    // Container configuration for all screens
    container: {
      center: true, // Centers the container horizontally
      padding: '2rem', // Applies 2rem padding to the container
      screens: {
        '2xl': '1400px', // Defines a new extra large screen breakpoint at 1400px
      },
    },

    // Extends the default Tailwind theme with custom properties
    extend: {
      colors: {
        // Custom color palette
        'primary-500': '#877EFF',
        'primary-600': '#5D5FEF',
        'secondary-500': '#FFB620',
        'off-white': '#D0DFFF',
        'red': '#FF5A5A',
        'dark-1': '#000000',
        'dark-2': '#09090A',
        'dark-3': '#101012',
        'dark-4': '#1F1F22',
        'light-1': '#FFFFFF',
        'light-2': '#EFEFEF',
        'light-3': '#7878A3',
        'light-4': '#5C5C7B',
        'ecurie-babyblue': '#0064C8',
        'ecurie-lightgrey': '#CCCCCC',
        'ecurie-darkblue': '#00468C',
        'ecurie-lightblue': '#8AB8E6',
        'ecurie-lightred': '#C74C46',
        'ecurie-darkred': '#941710',
        'ecurie-red': '#C61E15',
        'ecurie-blue': '#0055AA',
        'ecurie-darkgrey': '#666666',
        'ecurie-grey': '#999999',
        'ecurie-pink': '#8A2560',
      },
      screens: {
        // Adds an extra small screen breakpoint at 480px
        'xs': '480px',
      },
      minHeight: {
        '100': '32rem',
      },
      width: {
        '420': '420px',
        '465': '465px',
      },
      fontFamily: {
        // Defines a custom font 
        'Univers LT Std': ['"UniversLTStd"', 'system-ui', 'sans-serif'],
        'Univers_LT_Std_57': ['"UniversLTStd57"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        // Defines custom animation keyframes for accordion content expansion/collapse
        'accordion-down': {
          from: { height: 0 }, // Starts from 0 height
          to: { height: 'var(--radix-accordion-content-height)' }, // Animates to accordion content height
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' }, // Starts from accordion content height
          to: { height: 0 }, // Animates to 0 height
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        // Defines animation names using the keyframes
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      maskImage: {
        'gradient-mask': 'linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1) 60%, rgba(0, 0, 0, 0))',
      },
    },
  },
  variants: {
    extend: {},
  },
  // Includes the tailwindcss-animate plugin for animation utilities
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities }) {
      const newUtilities = {
        '.mask-gradient': {
          '-webkit-mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0))',
          'mask-image': 'linear-gradient(to right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 0))',
          'transition': 'filter 0.9s, -webkit-mask-image 0.9s, mask-image 0.9s',
        },
      };

      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
};

