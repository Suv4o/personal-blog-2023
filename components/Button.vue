<template>
    <div class="flex" :class="classes">
        <button
            v-if="subscribe"
            :disabled="disabled"
            type="submit"
            class="btn hover:scale-105 focus:scale-105 transition-transform duration-300 ease-in-out focus:outline-none disabled:cursor-default"
        >
            {{ subscribeBtnName }}
        </button>
        <NuxtLink
            v-else
            :to="link"
            class="!pointer-events-auto btn hover:scale-105 focus:scale-105 transition-transform duration-300 ease-in-out focus:outline-none"
        >
            <div :class="`${smallFit ? 'small-fit' : ''}`" :style="`${width ? width : ''}`">
                <slot></slot>
            </div>
        </NuxtLink>
    </div>
</template>

<script>
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false,
        },
        link: {
            type: String,
            default: "/",
        },
        classes: {
            type: String,
            default: "justify-center mt-50 mb-50",
        },
        subscribe: {
            type: Boolean,
            default: false,
        },
        subscribeBtnName: {
            type: String,
            default: "Subscribe!",
        },
        smallFit: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            required: false,
        },
    },
};
</script>

<style scoped>
.btn {
    @apply text-lg border-2 border-white shadow-[5px_5px] shadow-beige cursor-pointer text-white rounded-lg inline-block px-4 py-2 overflow-hidden bg-inherit text-center whitespace-nowrap appearance-none m-0;
    background: linear-gradient(90deg, rgb(var(--colour-primary-light)), rgb(var(--colour-primary)));
}

.small-width-100 {
    width: 10px !important;
}

.blue .btn {
    background: linear-gradient(90deg, rgb(var(--colour-secondary-light)), rgb(var(--colour-secondary)));
}

.small .btn {
    @apply text-sm border-2 border-white shadow-[5px_5px] shadow-beige cursor-pointer text-white rounded-lg inline-block px-4 py-2 overflow-hidden bg-inherit text-center whitespace-nowrap appearance-none m-0;
}

@media (max-width: 767px) {
    .small-fit {
        @apply block w-[85vw] whitespace-nowrap overflow-hidden overflow-ellipsis;
    }
}

.reverse .btn {
    background: linear-gradient(90deg, rgb(var(--colour-primary)), rgb(var(--colour-primary-light)));
}

.btn:hover,
.btn:focus {
    @apply shadow-[7px_7px] shadow-beige text-lg border-2 border-white;
}

.small .btn:hover,
.small .btn:focus {
    @apply shadow-[7px_7px] shadow-beige text-sm border-2 border-white;
}
</style>
