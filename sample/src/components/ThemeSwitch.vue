<script setup>
import { ref, watch } from "vue";

// the default theme is dark themes
const isLightTheme = ref(localStorage.getItem("theme") || false);

watch(isLightTheme, async function (newValue, oldValue) {
    localStorage.setItem("theme", newValue);
    document.body.classList.toggle("light-theme");
});
</script>

<template>
    <div class="pinned">
        <input class="toggle" v-model="isLightTheme" type="checkbox" />
    </div>
</template>

<style scoped>
.pinned {
    position: absolute;
    top: 8px;
    right: 8px;
}

.toggle {
    appearance: none;
    position: relative;
    display: inline-block;
    box-sizing: content-box;
    width: 4.5em;
    height: 2em;
    padding: 0.1em;
    border: none;
    cursor: pointer;
    border-radius: 1.5em;
    overflow: hidden;
    background-color: #1b2026;
    transition: background ease 0.3s;
}

.toggle:before {
    content: "☀️ 🌙";
    display: block;
    position: absolute;
    z-index: 2;
    width: 2em;
    height: 2em;
    font-family: system-ui;
    font-size: 1em;
    line-height: 2em;
    font-weight: 500;
    text-transform: uppercase;
    text-indent: -2em;
    word-spacing: 3.2em;
    text-shadow: -1px -1px rgba(0, 0, 0, 0.15);
    white-space: nowrap;
    background: #fff;
    color: #fff;
    border-radius: 1.5em;
    transition: transform cubic-bezier(0.3, 1.5, 0.7, 1) 0.3s;
}

.toggle:checked {
    background-color: #7f9996;
}

.toggle:checked:before {
    transform: translateX(2.5em);
}
</style>
