/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    navy: '#0A192F', // Deep Navy (Space to SaaS primary)
                    gold: '#F59E0B', // Amber Gold
                    white: '#FFFFFF',
                    gray: '#F8FAFC',
                },
                alert: {
                    red: '#FF4D4F', // Critical warnings
                },
                success: {
                    teal: '#00BFA5', // Achievements
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
