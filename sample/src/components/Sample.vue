<script setup>
const props = defineProps({
    picture: String,
    name: String,
});
</script>

<template>
    <div class="container">
        <div>
            <img :style="{ 'background-image': `url(` + picture + `)` }" />
            <div>
                <span>{{ name }}</span>
                <span class="static">Creative Personal</span>
            </div>
        </div>
        <button>Upgrade</button>
    </div>
</template>

<style scoped>
.container,
.container div:first-child div {
    display: flex;
    flex-direction: column;
}

.container div:first-child {
    display: flex;
    flex-direction: row;
    align-items: center;
}

img {
    width: 48px;
    height: 48px;
    background-clip: border-box;
    background-position: center;
    background-size: 48px;
    border-radius: 24px;
}

span {
    font-size: 1.2em;
    margin-left: 16px;
    font-weight: 800;
}

.static {
    font-size: 0.8em;
    font-weight: 100;
    color: darkslategray;
}

button {
    margin-top: 16px;
}
</style>
