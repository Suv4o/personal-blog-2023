<template>
    <div class="tags" :class="`${small ? 'tags-small' : 'tags-large'}`">
        <NuxtLink
            class="focus:outline-none inline-block hover:scale-110 focus:scale-110 transition-all duration-300 ease-in-out"
            v-for="(tag, index) in tags"
            :key="index"
            :to="`${
                tag == 'Vue.js'
                    ? tagDetails[0].link
                    : tag == 'JavaScript'
                      ? tagDetails[1].link
                      : tag == 'FrontEnd'
                        ? tagDetails[2].link
                        : tag == 'Firebase'
                          ? tagDetails[3].link
                          : tag == 'Node.js'
                            ? tagDetails[4].link
                            : tag == 'BackEnd'
                              ? tagDetails[5].link
                              : tag == 'CSS'
                                ? tagDetails[6].link
                                : tag == 'TypeScript'
                                  ? tagDetails[7].link
                                  : tag == 'Nest.js'
                                    ? tagDetails[8].link
                                    : tag == 'Nuxt.js'
                                      ? tagDetails[9].link
                                      : tag == 'VSCode'
                                        ? tagDetails[10].link
                                        : tag == 'Vite'
                                          ? tagDetails[11].link
                                          : tag == 'AI'
                                            ? tagDetails[12].link
                                            : tag == 'LangChain'
                                              ? tagDetails[13].link
                                              : tag == 'Python'
                                                ? tagDetails[14].link
                                                : tag == 'Nitro'
                                                  ? tagDetails[15].link
                                                  : tag == 'React.js'
                                                    ? tagDetails[16].link
                                                    : tag == 'Hobby'
                                                      ? tagDetails[17].link
                                                      : tag == 'Tech'
                                                        ? tagDetails[18].link
                                                        : tag == 'Entertainment'
                                                          ? tagDetails[19].link
                                                          : tagDetails[20].link
            }`"
        >
            <div
                :class="[
                    tag == 'Vue.js'
                        ? 'bg-green'
                        : tag == 'JavaScript'
                          ? 'bg-javascript'
                          : tag == 'FrontEnd'
                            ? 'bg-secondary'
                            : tag == 'Firebase'
                              ? 'bg-firebase'
                              : tag == 'Node.js'
                                ? 'bg-node'
                                : tag == 'BackEnd'
                                  ? 'bg-backend'
                                  : tag == 'CSS'
                                    ? 'bg-css'
                                    : tag == 'TypeScript'
                                      ? 'bg-typescript'
                                      : tag == 'Nest.js'
                                        ? 'bg-nestjs'
                                        : tag == 'Nuxt.js'
                                          ? 'bg-nuxtjs'
                                          : tag == 'VSCode'
                                            ? 'bg-vscode'
                                            : tag == 'Vite'
                                              ? 'bg-vite'
                                              : tag == 'AI'
                                                ? 'bg-ai'
                                                : tag == 'LangChain'
                                                  ? 'bg-langchain'
                                                  : tag == 'Python'
                                                    ? 'bg-python'
                                                    : tag == 'Nitro'
                                                      ? 'bg-nitro'
                                                      : tag == 'React.js'
                                                        ? 'bg-reactjs'
                                                        : tag == 'Hobby'
                                                          ? 'bg-hobby'
                                                          : tag == 'Tech'
                                                            ? 'bg-tech'
                                                            : tag == 'Entertainment'
                                                              ? 'bg-entertainment'
                                                              : 'bg-other',
                    small ? 'text-xs' : 'text-sm',
                    tag == 'Vue.js'
                        ? '!text-white'
                        : tag == 'JavaScript'
                          ? 'text-secondary'
                          : tag == 'FrontEnd'
                            ? 'text-white'
                            : tag == 'Firebase'
                              ? 'text-secondary'
                              : tag == 'Node.js'
                                ? 'text-white'
                                : tag == 'BackEnd'
                                  ? 'text-white'
                                  : tag == 'CSS'
                                    ? 'text-white'
                                    : tag == 'TypeScript'
                                      ? 'text-white'
                                      : tag == 'Nest.js'
                                        ? 'text-white'
                                        : tag == 'Nuxt.js'
                                          ? 'text-green-light'
                                          : tag == 'VSCode'
                                            ? 'text-white'
                                            : tag == 'Vite'
                                              ? 'text-white'
                                              : tag == 'AI'
                                                ? 'text-secondary'
                                                : tag == 'LangChain'
                                                  ? 'text-secondary'
                                                  : tag == 'Python'
                                                    ? 'text-white'
                                                    : tag == 'Nitro'
                                                      ? 'text-black'
                                                      : tag == 'React.js'
                                                        ? 'text-black'
                                                        : tag == 'Hobby'
                                                          ? 'text-white'
                                                          : tag == 'Tech'
                                                            ? 'text-white'
                                                            : tag == 'Entertainment'
                                                              ? 'text-black'
                                                              : 'text-white',
                ]"
            >
                {{ tag }}
            </div>
        </NuxtLink>
    </div>
</template>

<script>
export default {
    props: {
        tags: {
            type: Array,
            required: true,
        },
        small: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            tagDetails: [
                { bg: "#40979d", txt: "#ffffff", link: "/vuejs" },
                { bg: "#FFD700", txt: "#173353", link: "/javascript" },
                { bg: "#173353", txt: "#ffffff", link: "/frontend" },
                { bg: "#ff9900", txt: "#173353", link: "/firebase" },
                { bg: "#3e863d", txt: "#ffffff", link: "/nodejs" },
                { bg: "#4d1300", txt: "#ffffff", link: "/backend" },
                { bg: "#a30d8a", txt: "#ffffff", link: "/css" },
                { bg: "#3075bf", txt: "#ffffff", link: "/typescript" },
                { bg: "#d42148", txt: "#ffffff", link: "/nestjs" },
                { bg: "#022832", txt: "#00dd82", link: "/nuxtjs" },
                { bg: "#3aa8f0", txt: "#ffffff", link: "/vscode" },
                { bg: "#bd34fe", txt: "#ffc31d", link: "/vite" },
                { bg: "#03e3fc", txt: "#ffffff", link: "/ai" },
                { bg: "#6ffc03", txt: "#ffffff", link: "/langchain" },
                { bg: "#356B99", txt: "#ffffff", link: "/python" },
                { bg: "#f777b0", txt: "#191919", link: "/nitro" },
                { bg: "#61dafb", txt: "#3d3d3d", link: "/reactjs" },
                { bg: "#d4703e", txt: "#3d3d3d", link: "/hobby" },
                { bg: "#83a198", txt: "#3d3d3d", link: "/tech" },
                { bg: "#dba85a", txt: "#3d3d3d", link: "/entertainment" },
                { bg: "#ee5f53", txt: "#ffffff", link: "/other" },
            ],
        };
    },
};
</script>

<style scoped>
@reference "../assets/css/main.css";

.tags div:hover {
    @apply opacity-80;
}

.tags-large > a:not(:last-child),
button:not(:last-child) {
    @apply mr-3 mb-3;
}

.tags-large div {
    @apply px-4 py-2 rounded-full text-sm;
}

.tags-small > a:not(:last-child),
button:not(:last-child) {
    @apply mr-2 mb-2;
}

.tags-small div {
    @apply px-3 py-1 rounded-full text-xs;
}
</style>
