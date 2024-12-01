<script setup>
import "@/assets/main.css";
import { RouterView } from "vue-router";
import { onMounted } from "vue";

onMounted(() => {
    const val = localStorage.getItem("theme") === "true";
    if (val) {
        document.body.classList.toggle("light-theme");
    }
});
</script>

<template>
    <main>
        <RouterView />
    </main>
</template>
