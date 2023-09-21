/** @type {import('tailwindcss').Config} */
export default {
    content: ["*.{vue,js,md}", "components/**/*.{vue,js}", "layouts/**/*.vue", "pages/**/*.vue"],
    theme: {
        extend: {
            colors: {
                primary: "#ee5f53",
                "primary-light": "#f1918b",
                secondary: "#173353",
                "secondary-light": "#37506e",
                "blue-hour": "#37506e",
                "green-light": "#00dd82",
                green: "#40979d",
                beige: "#d8d7c1",
                "beige-gray": "#9b9b9b",
                gray: "#6d6e71",
                "linkedin-blue": "#1786b1",
                javascript: "#ffd700",
                firebase: "#ff9900",
                node: "#3e863d",
                backend: "#4d1300",
                css: "#a30d8a",
                typescript: "#3075bf",
                nestjs: "#d42148",
                nuxtjs: "#022832",
                vscode: "#3aa8f0",
                vite: "#bd34fe",
                other: "#ee5f53",
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
