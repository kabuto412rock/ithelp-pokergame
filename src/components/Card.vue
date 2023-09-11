<script setup>
defineProps({
    symbol: String,
    num: Number
});
</script>
<template>
    <div class="card">
        <div>{{ symbol }}{{ num }}</div>
    </div>
</template>
<style scoped>
div.card {
    --card-font-size: 1.5rem;
    --card-width: 5rem;
    width: var(--card-width);
    height: calc(var(--card-width)*1.5);
    border: 1px solid black;
    border-radius: 5%;
    background-color: white;
    padding: 3px;
    font-size: var(--card-font-size);
}
</style>