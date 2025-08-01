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

const jobOpenings = [
    {
        id: 1,
        role: "Full-time designer",
        href: "#",
        description:
            "Quos sunt ad dolore ullam qui. Enim et quisquam dicta molestias. Corrupti quo voluptatum eligendi autem labore.",
        salary: "$75,000 USD",
        location: "San Francisco, CA",
    },
    {
        id: 2,
        role: "Laravel developer",
        href: "#",
        description:
            "Et veniam et officia dolorum rerum. Et voluptas consequatur magni sapiente amet voluptates dolorum. Ut porro aut eveniet.",
        salary: "$125,000 USD",
        location: "San Francisco, CA",
    },
    {
        id: 3,
        role: "React Native developer",
        href: "#",
        description:
            "Veniam ipsam nisi quas architecto eos non voluptatem in nemo. Est occaecati nihil omnis delectus illum est.",
        salary: "$105,000 USD",
        location: "San Francisco, CA",
    },
];
</script>

<template>
    <div class="text-gray text-lg break-words">
        <Button classes="my-8" :link="parentPath">← Back</Button>
        <div class="flex flex-col items-end justify-between gap-16 lg:mx-0 lg:max-w-none lg:flex-row">
            <div>
                <h2 class="text-3xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl">
                    We’re always looking for awesome people to join us
                </h2>
                <p class="mt-6 text-xl/8 text-gray-600">
                    Diam nunc lacus lacus aliquam turpis enim. Eget hac velit est euismod lacus. Est non placerat nam
                    arcu. Cras purus nibh cursus sit eu in id.
                </p>
                <img
                    src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1344&h=1104&q=80"
                    alt=""
                    class="mt-16 aspect-6/5 w-full rounded-2xl bg-gray-50 object-cover lg:aspect-auto lg:h-138"
                />
            </div>
            <div class="w-full lg:max-w-xl lg:flex-auto">
                <h3 class="sr-only">Job openings</h3>
                <ul class="-my-8 divide-y divide-gray-100">
                    <li v-for="opening in jobOpenings" :key="opening.id" class="py-8">
                        <dl class="relative flex flex-wrap gap-x-3">
                            <dt class="sr-only">Role</dt>
                            <dd class="w-full flex-none text-lg font-semibold tracking-tight text-gray-900">
                                <a :href="opening.href">
                                    {{ opening.role }}
                                    <span class="absolute inset-0" aria-hidden="true" />
                                </a>
                            </dd>
                            <dt class="sr-only">Description</dt>
                            <dd class="mt-2 w-full flex-none text-base/7 text-gray-600">
                                {{ opening.description }}
                            </dd>
                            <dt class="sr-only">Salary</dt>
                            <dd class="mt-4 text-base/7 font-semibold text-gray-900">{{ opening.salary }}</dd>
                            <dt class="sr-only">Location</dt>
                            <dd class="mt-4 flex items-center gap-x-3 text-base/7 text-gray-500">
                                <svg viewBox="0 0 2 2" class="size-0.5 flex-none fill-gray-300" aria-hidden="true">
                                    <circle cx="1" cy="1" r="1" />
                                </svg>
                                {{ opening.location }}
                            </dd>
                        </dl>
                    </li>
                </ul>
                <div class="mt-8 flex border-t border-gray-100 pt-8">
                    <a href="#" class="text-sm/6 font-semibold text-indigo-600 hover:text-indigo-500"
                        >View all openings <span aria-hidden="true">&rarr;</span></a
                    >
                </div>
            </div>
        </div>
    </div>
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
    @apply w-full h-full rounded-md mb-6;
}

ol li {
    @apply my-2 list-decimal list-outside relative left-6 pr-6;
}

ul li {
    @apply my-2 list-disc list-outside relative left-6 pr-6;
}

hr {
    @apply border-t border-green mt-4;
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
