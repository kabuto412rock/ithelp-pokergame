<script setup>
import { PokerValuesMap } from "../utils/constants";
const props = defineProps({
    value: Number,
    isOpen: Boolean
});
const pokerValue = props.value;
// 對應撲克花色符號，Ex: ♣A
const content = PokerValuesMap[pokerValue].content;
// 對應撲克顏色class
const numberClass = PokerValuesMap[pokerValue].isRed ? 'card card-red' : 'card';
</script>
<template>
    <div :class="numberClass">
        <div>{{ content }}</div>
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

.card-red {
    color: red;
}
</style>