<script setup lang="ts"></script>

<template>
    <div>
        <div class="text-4xl text-center text-secondary mt-12 mb-6"><strong>THE KEYBOARD LAB</strong></div>
        <arrow-down class="mb-6"></arrow-down>
        <div class="flex justify-center mt-6">
            <img
                src="https://res.cloudinary.com/suv4o/image/upload/q_auto,f_auto,w_1200,e_sharpen:100/v1751774465/blog/Emoji_-_Aleks_with_Keyboard_xo5zyy"
                alt="Aleks emoji holding keyboard"
                class="w-full rounded-md max-w-[700px]"
            />
        </div>
        <arrow-down class="mt-12"></arrow-down>
        <div class="flex justify-center mt-12">
            <p class="text-gray text-center text-lg sm:text-xl">
                <strong>Welcome to The Keyboard Lab</strong> — a dedicated corner of my blog where I showcase some of my
                favorite custom mechanical keyboards. I’ve built this space to document not just the boards themselves,
                but also the details that make each one unique — from the switches and keycaps to the mods and layouts.
                You’ll find build specs, personal notes on why I chose certain components, and insights that might help
                you on your own mechanical keyboard journey. Whether you’re just getting into the hobby or already deep
                in the rabbit hole, I hope this page sparks some inspiration.
            </p>
        </div>
        <arrow-down class="my-12"></arrow-down>
        <TheKeyboardLabListing />
    </div>
</template>
