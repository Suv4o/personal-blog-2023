<script setup lang="ts">
const titleRef = ref();
const dateRef = ref();
const tagsRef = ref();
const contentBlockRef = ref();
const descriptionRef = ref();
const tags = ref(["Firebase", "Vite", "TypeScript"]);
const lineClamp = ref();

onMounted(() => {
    addResizeListener();
    setLineClamp();
});

onBeforeUnmount(() => {
    removeResizeListener();
});

function addResizeListener() {
    window.addEventListener("resize", setLineClamp);
}

function removeResizeListener() {
    window.removeEventListener("resize", setLineClamp);
}

function setLineClamp() {
    const numLines = getNumberOfForDescriptionLines();
    lineClamp.value = `line-clamp-[${numLines}]`;
}

function getHeightOfTheContentBlock() {
    return contentBlockRef.value.offsetHeight;
}

function getHeightOfTitle() {
    return titleRef.value.offsetHeight;
}

function getHeightOfDate() {
    return dateRef.value.offsetHeight;
}

function getHeightOfTags() {
    return tagsRef.value.offsetHeight;
}

function getNumberOfForDescriptionLines() {
    const descriptionHeight = getHeightOfTheContentBlock() - getHeightOfTitle() - getHeightOfDate() - getHeightOfTags();
    const lineHeight = parseInt(getComputedStyle(descriptionRef.value).lineHeight) + 28;
    const numRows = Math.ceil(descriptionHeight / lineHeight);
    return numRows;
}
</script>

<template>
    <NuxtLink
        to="/"
        class="block w-full h-80 bg-beige rounded-md my-9 lg:hover:scale-105 lg:focus:scale-105 focus:outline-none transition-transform duration-300 ease-in-out card_shadow overflow-hidden"
    >
        <div class="sm:flex">
            <div
                class="hidden sm:block sm:w-6/12 h-80 bg-cover bg-center no-repeat"
                :style="{
                    backgroundImage:
                        'url(https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_750,e_sharpen:100/v1618488085/blog/the_misterios_this_keyword_in_vueland)',
                }"
            ></div>
            <div class="w-full sm:w-7/12 h-80 px-4 sm:px-10 py-4 flex flex-col justify-center" ref="contentBlockRef">
                <h2 class="text-secondary font-bold text-2xl" ref="titleRef">
                    Single Sign On (SSO) with Firebase Authentication across multiple domains
                </h2>
                <p class="text-secondary font-light italic text-base" ref="dateRef">2nd April 2023</p>
                <div class="my-2" ref="tagsRef">
                    <TagPills small :tags="tags" />
                </div>
                <p class="text-base text-gray" :class="lineClamp" ref="descriptionRef">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Massa tempor nec feugiat nisl pretium. Phasellus faucibus scelerisque
                    eleifend donec pretium vulputate sapien nec sagittis. Dignissim convallis aenean et tortor at.
                    Blandit massa enim nec dui nunc mattis enim ut tellus. Vel pretium lectus quam id. Purus in mollis
                    nunc sed id semper risus in hendrerit. Vivamus arcu felis bibendum ut tristique et egestas. Sem et
                    tortor consequat id porta nibh venenatis cras. Dictumst quisque sagittis purus sit amet volutpat.
                    Molestie nunc non blandit massa enim nec dui nunc. Pellentesque diam volutpat commodo sed egestas
                    egestas fringilla phasellus. Cras ornare arcu dui vivamus arcu felis bibendum ut tristique. Et
                    tortor at risus viverra adipiscing at in. Eget aliquet nibh praesent tristique magna sit amet. Sem
                    fringilla ut morbi tincidunt augue interdum velit euismod. Quis viverra nibh cras pulvinar mattis
                    nunc sed blandit libero. Diam volutpat commodo sed egestas egestas fringilla phasellus. Semper eget
                    duis at tellus at urna condimentum mattis pellentesque. Nam libero justo laoreet sit amet cursus.
                    Libero enim sed faucibus turpis in eu mi bibendum neque. Amet aliquam id diam maecenas.
                </p>
            </div>
        </div>
    </NuxtLink>
</template>

<style scoped>
.card_shadow {
    box-shadow:
        0 4px 10px 0 rgb(0 0 0 / 20%),
        0 4px 20px 0 rgb(0 0 0 / 19%);
}
</style>
