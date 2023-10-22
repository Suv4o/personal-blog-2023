<script setup lang="ts">
const config = useRuntimeConfig();
const router = useRoute();

async function unsubscribe() {
    try {
        await fetch(config.public.UNSUBSCRIBE_TO_NEWSLETTERS_URL + `/${router?.query?.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error(error);
    }
}

onMounted(async () => {
    if (router?.query?.id) {
        await unsubscribe();
    }
});
</script>

<template>
    <div>
        <p class="text-center text-2xl text-secondary mt-12">
            You have successfully unsubscribed from receiving new updates related to the blog.
        </p>
    </div>
</template>
