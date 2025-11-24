// tailwind.config.js
import { transform } from 'style-dictionary';
import * as tokens from './src/design-tokens/build/tailwind-tokens.js';

// Helper function to convert gradient tokens to CSS gradient strings
const createGradient = (gradientToken) => {
  if (typeof gradientToken === 'string') return gradientToken;
  
  return `linear-gradient(${gradientToken.rotation}deg, ${gradientToken.stops.map(stop => 
    `${stop.color} ${stop.position * 100}%`
  ).join(', ')})`;
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: false,
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {

      keyframes: {
        rotate: {     /*sun animation */
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        'rotate-slow': 'rotate 20s linear infinite',
      },
      
      colors: {
        'button': tokens.ColorButton,
        'mid-day': tokens.ColorMidDay,
        'night-day': tokens.ColorNightDay,
        'glass-bg': tokens.ColorGlassBackground,
        'white': tokens.VariableCollectionColorwhite,
        'dark-purple': tokens.VariableCollectionDarkpurple,
        'font-color': tokens.VariableCollectionFontcolor,
        'font-color-2': tokens.VariableCollectionFontcolor2,
        'light-pink': tokens.VariableCollectionLighpink,
        'nav-panel': tokens.VariableCollectionNavbanel,
        'bluish': tokens.VariableCollectionBluish,
        'sidebar': tokens.VariableCollectionSidebar,
        'wind': tokens.VariableCollectionWind,
        'sunny-yellow': tokens.VariableCollectionSunnyyellow,
        'vip-color': tokens.GradientVipcolor21,
      },
      backgroundImage: {
        'vip-gradient': createGradient(tokens.GradientVipcolor),
        'clear-sky': createGradient(tokens.GradientBackgroundClearsky),
        'snowy': createGradient(tokens.GradientSnowy),
        'morning-day': createGradient(tokens.GradientMorningDay),
        'cloudy-bg': createGradient(tokens.GradientCloudyBackground),
        'rainy-bg': createGradient(tokens.GradientRainyBackground),
        'half-snow-cloudy': createGradient(tokens.GradientHalfSnowHalfCloudyBg),
        'high-temp': createGradient(tokens.GradientHighTemp),
        'mild-temp': createGradient(tokens.GradientMildTemp),
        'cold-temp': createGradient(tokens.GradientColdTemp),
        'freezing-temp': createGradient(tokens.GradientFreezingTemp),
        'foggy-bg': createGradient(tokens.GradientFoggyBackground),
        'snowy-bg': createGradient(tokens.GradientSnowyBackground),
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'], 
        'inter': ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],  
};

