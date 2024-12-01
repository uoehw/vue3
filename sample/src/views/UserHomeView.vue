<script setup>
import AppBackground from "../components/AppBackground.vue";
import { useUserStore } from "@/stores/user.js";
import { useRouter } from "vue-router";

// create user store object
const user = useUserStore();

// router instance
const router = useRouter();

async function logout() {
    await user.logout();
    router.push({ name: "home", replace: true });
}
</script>

<template>
    <div class="container">
        <AppBackground />
        <div class="content">
            <span class="welcome">Welcome home!</span>
            <span class="name">{{ user.firstname }} {{ user.lastname }}</span>
            <button @click="logout">Logout</button>
        </div>
    </div>
</template>

<style scoped>
div.container {
    position: relative;
    height: 100vh;
}

button {
    background: none;
    outline: none;
    border: none;
    font-size: 1.2em;
    font-family: "Roboto Condensed", sans-serif;
}

div.content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
}

span.welcome {
    font-weight: 400;
    font-style: normal;
    text-align: center;
    font-size: 3.5em;
    color: var(--sample-primary-color-1);
    font-family: "Great Vibes", cursive;
}

span.name {
    font-weight: 400;
    font-size: 1.8em;
    font-family: "Edu AU VIC WA NT Pre", cursive;
}
</style>
