/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.ts"],
    theme: {
        extend: {
            colors: {
                primary: "#282C34",
                secondary: "#757CE8",
            },
        },
    },
    plugins: [],
};
