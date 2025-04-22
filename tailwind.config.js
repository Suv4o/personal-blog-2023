/** @type {import('tailwindcss').Config} */
export default {
    content: ["*.{vue,js,md}", "components/**/*.{vue,js}", "content/**/*.md", "layouts/**/*.vue", "pages/**/*.vue"],
    theme: {
        extend: {
            screens: {
                xs: "390px",
            },
            colors: {
                primary: "rgb(var(--color-primary) / <alpha-value>)", // #ee5f53
                "primary-light": "rgb(var(--color-primary-light) / <alpha-value>)", // #f1918b
                "code-inline-blue": "rgb(var(--color-code-inline-blue) / <alpha-value>)", // #295a92
                secondary: "rgb(var(--color-secondary) / <alpha-value>)", // #173353
                "secondary-light": "rgb(var(--color-secondary-light) / <alpha-value>)", // #37506e
                "green-light": "rgb(var(--color-green-light) / <alpha-value>)", // #00dd82
                "green-blue": "rgb(var(--color-green-blue) / <alpha-value>)", // #bfd9db
                green: "rgb(var(--color-green) / <alpha-value>)", // #40979d
                beige: "rgb(var(--color-beige) / <alpha-value>)", // #d8d7c1
                "beige-light": "rgb(var(--color-beige-light) / <alpha-value>)", // #efe8df
                "beige-gray": "rgb(var(--color-beige-gray) / <alpha-value>)", // #9b9b9b
                gray: "rgb(var(--color-gray) / <alpha-value>)", // #6d6e71
                "gray-secondary": "rgb(var(--color-gray-secondary) / <alpha-value>)", // #74869b
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
                mustard: "rgb(var(--color-mustard) / <alpha-value>)", // #ffc31d
                ai: "rgb(var(--color-ai) / <alpha-value>)", // #03e3fc
                langchain: "rgb(var(--color-langchain) / <alpha-value>)", // #6ffc03
                python: "rgb(var(--color-python) / <alpha-value>)", // #356B99
                nitro: "rgb(var(--color-nitro) / <alpha-value>)", // #f777b0
                reactjs: "rgb(var(--color-reactjs) / <alpha-value>)", // #61dafb
                hobby: "rgb(var(--color-hobby) / <alpha-value>)", // #d4703e
                tech: "rgb(var(--color-tech) / <alpha-value>)", // #83a198
                entertainment: "rgb(var(--color-entertainment) / <alpha-value>)", // #dba85a
                other: "rgb(var(--color-other) / <alpha-value>)", // #ee5f53
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
