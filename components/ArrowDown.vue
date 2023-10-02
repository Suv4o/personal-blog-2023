<template>
    <div class="arrow__down">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25.903"
            height="26.165"
            viewBox="0 0 25.903 26.165"
            class="arrow-down-animation"
        >
            <g id="Group_1" data-name="Group 1" transform="translate(-947.049 -866.24)">
                <path
                    id="Path_1"
                    data-name="Path 1"
                    d="M970.123,880.5l-10.1,9.9-10.1-9.9"
                    fill="none"
                    stroke="#ee5f53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                />
                <path
                    id="Path_2"
                    data-name="Path 2"
                    d="M970.068,869.068l-10.1,9.9-10.1-9.9"
                    fill="none"
                    stroke="#ee5f53"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="4"
                />
            </g>
        </svg>
    </div>
</template>

<script>
export default {};
</script>

<style scoped>
.arrow__down {
    @apply flex justify-center;
}

@media (max-width: 419px) {
    .arrow__down svg {
        @apply h-5 w-5;
    }
}

.arrow-down-animation {
    -moz-animation: arrow-down-animation 2s infinite;
    -webkit-animation: arrow-down-animation 2s infinite;
    animation: arrow-down-animation 2s infinite;
}

@keyframes arrow-down-animation {
    0%,
    20%,
    50%,
    80%,
    100% {
        transform: translateY(0);
    }
    40% {
        transform: translateY(-13px);
    }
    60% {
        transform: translateY(-9px);
    }
}
</style>
