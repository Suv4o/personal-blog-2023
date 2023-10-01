/** @type {import('tailwindcss').Config} */
export default {
    content: ["*.{vue,js,md}", "components/**/*.{vue,js}", "content/**/*.md", "layouts/**/*.vue", "pages/**/*.vue"],
    theme: {
        extend: {
            screens: {
                xs: "390px",
            },
            colors: {
                primary: "rgb(var(--colour-primary) / <alpha-value>)", // #ee5f53
                "primary-light": "rgb(var(--colour-primary-light) / <alpha-value>)", // #f1918b
                "code-inline-blue": "rgb(var(--colour-code-inline-blue) / <alpha-value>)", // #295a92
                secondary: "rgb(var(--colour-secondary) / <alpha-value>)", // #173353
                "secondary-light": "rgb(var(--colour-secondary-light) / <alpha-value>)", // #37506e
                "green-light": "rgb(var(--colour-green-light) / <alpha-value>)", // #00dd82
                "green-blue": "rgb(var(--colour-green-blue) / <alpha-value>)", // #bfd9db
                green: "rgb(var(--colour-green) / <alpha-value>)", // #40979d
                beige: "rgb(var(--colour-beige) / <alpha-value>)", // #d8d7c1
                "beige-light": "rgb(var(--colour-beige-light) / <alpha-value>)", // #efe8df
                "beige-gray": "rgb(var(--colour-beige-gray) / <alpha-value>)", // #9b9b9b
                gray: "rgb(var(--colour-gray) / <alpha-value>)", // #6d6e71
                "gray-secondary": "rgb(var(--colour-gray-secondary) / <alpha-value>)", // #74869b
                "linkedin-blue": "rgb(var(--colour-linkedin-blue) / <alpha-value>)", // #1786b1
                javascript: "rgb(var(--colour-javascript) / <alpha-value>)", // #ffd700
                firebase: "rgb(var(--colour-firebase) / <alpha-value>)", // #ff9900
                node: "rgb(var(--colour-node) / <alpha-value>)", // #3e863d
                backend: "rgb(var(--colour-backend) / <alpha-value>)", // #4d1300
                css: "rgb(var(--colour-css) / <alpha-value>)", // #a30d8a
                typescript: "rgb(var(--colour-typescript) / <alpha-value>)", // #3075bf
                nestjs: "rgb(var(--colour-nestjs) / <alpha-value>)", // #d42148
                nuxtjs: "rgb(var(--colour-nuxtjs) / <alpha-value>)", // #022832
                vscode: "rgb(var(--colour-vscode) / <alpha-value>)", // #3aa8f0
                vite: "rgb(var(--colour-vite) / <alpha-value>)", // #bd34fe
                mustard: "rgb(var(--colour-mustard) / <alpha-value>)", // #ffc31d
                other: "rgb(var(--colour-other) / <alpha-value>)", // #ee5f53
            },
            fontFamily: {
                sans: ["Ubuntu", "sans-serif"],
            },
            safelist: [
                "line-clamp-[1]",
                "line-clamp-[2]",
                "line-clamp-[3]",
                "line-clamp-[4]",
                "line-clamp-[5]",
                "line-clamp-[6]",
                "line-clamp-[7]",
                "line-clamp-[8]",
            ],
        },
    },
    plugins: [require("@tailwindcss/forms")],
};
