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
const numberClass = PokerValuesMap[pokerValue].isRed ? 'card-red' : '';
const isOpenClass = props.isOpen ? '' : 'card-back ';
</script>
<template>
    <div class="card">
        <div class="card-front" :class="numberClass">{{ content }}</div>
        <div class="card-back"></div>
    </div>
</template>
<style scoped>
@keyframes card-rotate {
    0% {
        transform: rotateY(0);
    }

    100% {
        transform: rotateY(180deg);
    }
}

.card:hover {
    /** 結束後不會恢復原狀 */
    animation: card-rotate 0.5s forwards;
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
    /*hide backface*/
    background: url("http://127.0.0.1:5173/src/assets/imgs/foxy01.jpg") no-repeat center;
    backface-visibility: hidden;
    /** 避免超出背圖超出卡片 */
    background-size: cover;
    /* 使用 cover 属性来适应容器 */

    /*flip card-back behind card-front*/
    transform: rotateY(180deg);

}

.card-red {
    color: red;
}
</style>