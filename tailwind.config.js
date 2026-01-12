/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dhl: {
                    yellow: '#FFCC00',
                    red: '#D40511',
                },
                slate: {
                    900: '#0f172a', // Ensure standard slate is available if not default
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
