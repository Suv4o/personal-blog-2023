/** @type {import('tailwindcss').Config} */
export default {
    content: ["*.{vue,js,md}", "components/**/*.{vue,js}", "content/**/*.md", "layouts/**/*.vue", "pages/**/*.vue"],
    theme: {
        extend: {
            colors: {
                primary: "rgb(var(--color-primary) / <alpha-value>)", // #ee5f53
                "primary-light": "rgb(var(--color-primary-light) / <alpha-value>)", // #f1918b
                secondary: "rgb(var(--color-secondary) / <alpha-value>)", // #173353
                "secondary-light": "rgb(var(--color-secondary-light) / <alpha-value>)", // #37506e
                "green-light": "rgb(var(--color-green-light) / <alpha-value>)", // #00dd82
                green: "rgb(var(--color-green) / <alpha-value>)", // #40979d
                beige: "rgb(var(--color-beige) / <alpha-value>)", // #d8d7c1
                "beige-light": "rgb(var(--color-beige-light) / <alpha-value>)", // #efe8df
                "beige-gray": "rgb(var(--color-beige-gray) / <alpha-value>)", // #9b9b9b
                gray: "rgb(var(--color-gray) / <alpha-value>)", // #6d6e71
                "linkedin-blue": "rgb(var(--color-linkedin-blue) / <alpha-value>)", // #1786b1
                javascript: "rgb(var(--color-javascript) / <alpha-value>)", // #ffd700
                firebase: "rgb(var(--color-firebase) / <alpha-value>)", // #ff9900
                node: "rgb(var(--color-node) / <alpha-value>)", // #3e863d
                backend: "rgb(var(--color-backend) / <alpha-value>)", // #4d1300
                css: "rgb(var(--color-css) / <alpha-value>)", // #a30d8a
                typescript: "rgb(var(--color-typescript) / <alpha-value>)", // #3075bf
                nestjs: "rgb(var(--color-nestjs) / <alpha-value>)", // #d42148
                nuxtjs: "rgb(var(--color-nuxtjs) / <alpha-value>)", // #022832
                vscode: "rgb(var(--color-vscode) / <alpha-value>)", // #3aa8f0
                vite: "rgb(var(--color-vite) / <alpha-value>)", // #bd34fe
                other: "rgb(var(--color-other) / <alpha-value>)", // #ee5f53
            },
            fontFamily: {
                sans: ["Ubuntu", "sans-serif"],
            },
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
