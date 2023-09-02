/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.ts"],
    theme: {
        extend: {
            colors: {
                primary: "#282C34",
                secondary: "#757CE8",
            },
            animation: {
                fade: "fadeIn 1s ease-in",
            },
            keyframes: {
                fadeIn: {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
        },
    },
    plugins: [],
};
