<template>
    <div>
        <NuxtLink
            v-for="(tag, index) in tags"
            tabindex="-1"
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
                                                  : tagDetails[16].link
            }`"
        >
            <div>
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
                { bg: "#ee5f53", txt: "#ffffff", link: "/other" },
            ],
        };
    },
};
</script>
