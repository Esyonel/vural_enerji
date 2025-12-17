/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                "primary": "#13ec37", // Electric Green
                "primary-dark": "#0abf53",
                "accent": "#ff8800", // Dynamic Orange
                "login-accent": "#f27f0d",
                "background": {
                    light: '#f5f8f7',
                    dark: '#102217',
                },
                "background-light": "#f5f8f7", // Legacy support
                "background-dark": "#102217", // Legacy support
                "surface": {
                    light: '#ffffff',
                    dark: '#1a2e22'
                },
                "surface-light": "#ffffff", // Legacy support
                "surface-dark": "#1a2e22", // Legacy support
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
                "body": ["Inter", "Noto Sans", "sans-serif"],
                "sans": ["Inter", "Noto Sans", "sans-serif"], // Default sans
            },
        },
    },
    plugins: [],
}
