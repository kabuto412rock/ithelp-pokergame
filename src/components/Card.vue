<script setup>
import { onMounted } from "vue";
import { PokerValuesMap } from "../utils/constants";
const props = defineProps({
    value: Number,
    isOpen: Boolean
});
const pokerValue = props.value;
// 對應撲克花色符號，Ex: ♣A
const content = PokerValuesMap[pokerValue].content;
// 對應撲克顏色class
const numberClass = PokerValuesMap[pokerValue].isRed ? 'card-red' : '';
</script>
<template>
    <div class="card card-to-back">
        <div class="card-front" :class="numberClass">{{ content }}</div>
        <div class="card-back"></div>
    </div>
</template>
<style scoped>
@keyframes card-rotate-to-back {
    0% {
        transform: rotateY(0);
    }

    100% {
        transform: rotateY(180deg);
    }
}

.card-to-back {
    animation: card-rotate-to-back 0.5s ease-in-out forwards;
}

.card {
    --card-font-size: 1.5rem;
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

    transform: translateZ(0px);
}

div.card-back {
    position: absolute;
    /** 避免背圖因為padding超出框框 */
    left: 5%;
    width: 90%;
    height: 95%;
    /* 背圖 */
    background: url("http://127.0.0.1:5173/src/assets/imgs/foxy01.jpg") no-repeat center;
    /** hidden backface */
    backface-visibility: hidden;
    /* 使用 cover 屬性讓背景圖包裹在容器內 */
    background-size: cover;
    /*flip card-back behind card-front*/
    transform: rotateY(180deg);
}

.card-red {
    color: red;
}
</style>