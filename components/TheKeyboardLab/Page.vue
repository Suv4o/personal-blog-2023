<script setup lang="ts">
const route = useRoute();

const parentPath = computed(() => {
    const pathSegments = route.path.split("/").filter((segment) => segment !== "");
    if (pathSegments.length > 1) {
        pathSegments.pop();
        return "/" + pathSegments.join("/");
    }
    return "/";
});

const keyboardSpecs = [
    {
        id: 1,
        title: "Type of Keyboard",
        description: `
                    <ul class="list-disc pl-5">
                        <li>GMK87 Tenkeyless</li>
                        <li>Hot-swappable</li>
                        <li>Gasket-mounted</li>
                        <li>Plastic case</li>
                        <li>LCD screen + knob</li>
                        <li>Wireless + USB-C</li>
                    </ul>
                `,
    },
    {
        id: 2,
        title: "Type of Switches",
        description: `
                <ul class="list-disc pl-5">
                <li>Akko Cream Yellow Pro (Linear, 50g)</li>
                <li>Factory-lubed, re-lubed with Krytox 205g0</li>
                <li>Switch films added for improved sound and stability</li>
                </ul>
            `,
    },
    {
        id: 3,
        title: "Type of Keycaps",
        description: `
            <ul class="list-disc pl-5">
                <li>XDA Profile</li>
                <li>PBT plastic</li>
                <li>95-key set</li>
                <li>Blue & white colourway with cat illustrations</li>
            </ul>
        `,
    },
    {
        id: 4,
        title: "Type of Cable",
        description: `
            <ul class="list-disc pl-5">
                <li>Light blue coiled USB-C cable</li>
                <li>Aviator connector for modular look and tidier cable routing</li>
            </ul>
        `,
    },
    {
        id: 5,
        title: "Mods",
        description: `
            <ul class="list-disc pl-5">
                <li>Stabilisers removed and lubed with dielectric grease</li>
                <li>Switches lubed and filmed for smoother action and tighter sound</li>
                <li>Tape mod applied to back of PCB (3 layers of masking tape)</li>
                <li>Case stuffed with Poly-Fil to eliminate hollowness and deepen sound</li>
            </ul>
        `,
    },
];
</script>

<template>
    <div class="text-gray text-lg break-words">
        <Button classes="my-8" :link="parentPath">← Back</Button>
        <div class="flex flex-col gap-4 lg:mx-0 lg:max-w-none lg:flex-row lg:gap-16">
            <div class="lg:flex-1 lg:max-w-2xl">
                <h1 class="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
                    🐾 Pastel Paws
                </h1>
                <TheKeyboardLabTags description="cute, dreamy, pastel, cat-inspired" />
                <p class="mt-6 text-xl/8 text-gray-600">
                    Built for budget-conscious thock lovers, <strong>Pastel Paws</strong> is a custom TKL mechanical
                    keyboard that delivers premium feel, sound, and style without breaking the bank. Designed with
                    beginners in mind, this build features smooth typing, crisp acoustics, and playful visual flair with
                    animal-themed XDA keycaps and a coiled cable. It's
                    <strong>customised from the inside out</strong> with hand-lubed switches and stabilisers, a
                    gasket-mounted structure, and mods like tape and case stuffing for that satisfying "thock" sound.
                    Whether you're coding, writing, or just vibing to music, <strong>Pastel Paws</strong> makes every
                    keystroke feel personal.
                </p>
                <img
                    src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1344&h=1104&q=80"
                    alt=""
                    class="mt-8 aspect-6/5 w-full rounded-2xl bg-gray-50 object-cover lg:aspect-auto lg:h-138"
                />
            </div>
            <div class="w-full lg:w-64 lg:flex-none mb-6">
                <h2>Keyboard Specs</h2>
                <ul class="-my-4 divide-y divide-green">
                    <li v-for="specs in keyboardSpecs" :key="specs.id" class="py-4">
                        <dl class="relative flex flex-wrap gap-x-3">
                            <dt class="sr-only">Role</dt>
                            <dd class="w-full flex-none text-lg font-semibold tracking-tight text-gray-900">
                                {{ specs.title }}
                            </dd>
                            <dt class="sr-only">Description</dt>
                            <dd v-html="specs.description" class="mt-1 w-full flex-none text-base/7 text-gray-600"></dd>
                        </dl>
                    </li>
                </ul>
            </div>
        </div>
    </div>
    <hr />
</template>

<style scoped>
@reference "../../assets/css/main.css";

h1,
h2,
h3,
h4,
h5,
h6 {
    @apply font-bold my-4 text-secondary;
}

h1 {
    @apply text-4xl cursor-text;
}

h1 a {
    @apply pointer-events-none focus:outline-none;
}

h2 {
    @apply text-2xl sm:text-3xl cursor-text border-b border-green pb-1;
}

h2 a {
    @apply pointer-events-none focus:outline-none;
}

h3 {
    @apply text-xl sm:text-2xl cursor-text;
}

h3 a {
    @apply pointer-events-none focus:outline-none;
}

h4 {
    @apply text-lg sm:text-xl cursor-text;
}

h4 a {
    @apply pointer-events-none focus:outline-none;
}

h5 {
    @apply text-base sm:text-lg cursor-text;
}

h5 a {
    @apply pointer-events-none focus:outline-none;
}

h6 {
    @apply text-sm sm:text-base cursor-text;
}

h6 a {
    @apply pointer-events-none focus:outline-none;
}

p {
    @apply my-4;
}

img {
    @apply w-full rounded-md mb-6;
}

ol li {
    @apply my-2 list-decimal list-outside relative left-6 pr-6;
}

hr {
    @apply border-t border-green;
}

blockquote {
    @apply antialiased my-4 px-4 py-1 bg-green-blue text-secondary border-l-4 border-secondary rounded-md;
}

:not(h1, h2, h3, h4, h5, h6) a {
    @apply text-primary;
}

::selection {
    @apply bg-primary text-secondary;
}
</style>
