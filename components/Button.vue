<template>
    <div class="flex" :class="classes">
        <input
            v-if="subscribe"
            type="submit"
            :value="subscribeBtnName"
            class="btn hover:scale-105 focus:scale-105 transition-transform duration-300 ease-in-out focus:outline-none"
        />
        <router-link v-else :to="link">
            <button
                :class="`${smallFit ? 'small-fit' : ''}`"
                class="btn animated pulse-hover"
                :style="`${width ? width : ''}`"
            >
                <slot></slot>
            </button>
        </router-link>
    </div>
</template>

<script>
export default {
    props: {
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
    font-size: 18px;
    line-height: 1.6;
    border: 1.5px solid #fff !important;
    box-shadow: 5px 5px #d8d7c1;
    cursor: pointer;
    background: linear-gradient(90deg, #f1918b, #ee5f53);
    color: #fff !important;
    border-radius: 8px;
    user-select: none;
    display: inline-block;
    padding: 8px 16px;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    background-color: inherit;
    text-align: center;
    white-space: nowrap;
    -webkit-appearance: button;
    margin: 0;
}

.small-width-100 {
    width: 10px !important;
}

.blue .btn {
    font-size: 18px;
    line-height: 1.6;
    border: 1.5px solid #fff !important;
    box-shadow: 5px 5px #d8d7c1;
    cursor: pointer;
    background: linear-gradient(90deg, #37506e, #173353);
    color: #fff !important;
    border-radius: 8px;
    user-select: none;
    display: inline-block;
    padding: 8px 16px;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    background-color: inherit;
    text-align: center;
    white-space: nowrap;
    -webkit-appearance: button;
    margin: 0;
}

.small .btn {
    font-size: 13px;
    line-height: 1.6;
    border: 1.5px solid #fff !important;
    box-shadow: 5px 5px #d8d7c1;
    cursor: pointer;
    background: linear-gradient(90deg, #f1918b, #ee5f53);
    color: #fff !important;
    border-radius: 8px;
    user-select: none;
    display: inline-block;
    padding: 8px 16px;
    vertical-align: middle;
    overflow: hidden;
    text-decoration: none;
    background-color: inherit;
    text-align: center;
    white-space: nowrap;
    -webkit-appearance: button;
    margin: 0;
}

@media (max-width: 500px) {
    .small-fit {
        display: block;
        width: 85vw;
        white-space: nowrap;
        overflow: hidden !important;
        text-overflow: ellipsis;
    }
}

.reverse .btn {
    background: linear-gradient(90deg, #ee5f53, #f1918b);
}

.btn:hover {
    box-shadow: 7px 7px #d8d7c1;
    font-size: 18px;
    border: 1.5px solid #fff !important;
}

.small .btn:hover {
    box-shadow: 7px 7px #d8d7c1;
    font-size: 13px;
    border: 1.5px solid #fff !important;
}
</style>
