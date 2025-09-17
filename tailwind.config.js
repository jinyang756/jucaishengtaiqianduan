/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './login.html',
    './register.html',
    './user-profile.html',
    './system-settings.html',
    './src/**/*.{js,jsx,ts,tsx,vue,html,css}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#10B981',
        'primary-hover': '#059669',
        success: '#34D399',
        warning: '#F59E0B',
        danger: '#EF4444',
        'neutral-100': '#F9FAFB',
        'neutral-200': '#F3F4F6',
        'neutral-700': '#374151',
        'neutral-800': '#1F2937',
        'neutral-900': '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

