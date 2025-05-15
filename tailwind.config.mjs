/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            transitionProperty: {
                '3d': 'transform, transform-style',
            },
        },
    },
    plugins: [],
}; 