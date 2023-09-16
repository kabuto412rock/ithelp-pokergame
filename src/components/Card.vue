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
const content = PokerValuesMap[pokerValue]?.content ?? '';
// 對應撲克顏色class
const numberClass = PokerValuesMap[pokerValue]?.isRed ? 'card-red' : '';

</script>
<template>
    <div v-if="isDone" class="card card-done">
        <div>{{ content }}</div>
    </div>
    <div v-else="!isDone" class="card " @click="emit('poker-flip', value)">
        <Transition name="card-flip">
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
    background: url("@/assets/imgs/foxy01.jpg") no-repeat center;
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