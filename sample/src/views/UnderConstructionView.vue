<script setup>
import AppBackground from "../components/AppBackground.vue";
</script>

<template>
    <AppBackground />
    <div class="container">
        <span class="logo"></span>
        <div>
            <span>Oops!</span>
            <span>Page is under construction</span>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.container span.logo {
    width: 280px;
    height: 280px;
    background-image: url("@/assets/images/server.svg");
}

.container div {
    display: flex;
    flex-direction: column;
    justify-content: end;
    margin-left: 48px;
    margin-bottom: 18px;
    height: 30%;
    width: 40%;
    font-family: "Roboto Condensed", sans-serif;
}

.container span:first-child {
    font-size: 4.5em;
}

.container span:last-child {
    font-size: 1.9em;
}
</style>
