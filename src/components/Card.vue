<script setup>
import { computed } from "vue";
import { PokerValuesMap } from "../utils/constants";
const props = defineProps({
    value: Number,
    isOpen: Boolean,
    isDone: Boolean,
});
const emit = defineEmits(["poker-flip"]);
const pokerValue = props.value;
// 對應撲克花色符號，Ex: ♣A
const content = PokerValuesMap[pokerValue].content;
// 對應撲克顏色class
const numberClass = PokerValuesMap[pokerValue].isRed ? 'card-red' : '';


</script>
<template>
    <div v-show="isDone" class="card card-done">
        <div>{{ content }}</div>
    </div>
    <div v-show="!isDone" class="card " @click="emit('poker-flip', value)">
        <Transition name="card-flip" @click="isOPen = !isOPen">
            <div v-if="isOpen" class="card-front" :class="numberClass">{{ content }}</div>
            <div v-else class="card-back"></div>
        </Transition>
    </div>
</template>
<style scoped>
.card-flip-enter-active,
.card-flip-leave-active {
    transition: all 0.5s ease-out;
}

.card-flip-enter-from,
.card-flip-leave-to {
    opacity: 0;
}

.card {
    --card-font-size: 2rem;
    --card-width: 5rem;
    --card-height: calc(var(--card-width)*1.5);
    width: var(--card-width);
    height: var(--card-height);
    border: 1px solid black;
    border-radius: 5%;
    background-color: white;
    margin-right: 10px;
    font-size: var(--card-font-size);
    transform-style: preserve-3d;
}

.card div {
    display: block;
    position: absolute;
    backface-visibility: visible;
}

div.card-front {
    padding: 3px;
}

div.card-back {
    position: absolute;
    /** 避免背圖因為padding超出框框 */
    left: 5%;
    width: 90%;
    height: 95%;
    /* 背圖 */
    background: url("http://127.0.0.1:5173/src/assets/imgs/foxy01.jpg") no-repeat center;
    /* 使用 cover 屬性讓背景圖包裹在容器內 */
    background-size: cover;
}

.card-red {
    color: red;
}

.card-done {
    background-color: green;
    color: balck;
}
</style>