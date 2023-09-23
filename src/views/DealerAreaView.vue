<script setup>
import { computed, onMounted, ref } from 'vue';

import Card from '../components/Card.vue';
import GameBoard from '../components/GameBoard.vue';
import { geneateDeck } from '../utils/poker-helper';

const index = ref(0);
const deck = ref(geneateDeck(14, true));

function clickCard() {
    index.value++;
    if (index.value > deck.value.length) {
        index.value = 0;
    }
}
/** 玩家可拿取的牌 */
const canTakeCards = computed(() => {
    let startIndex = index.value < 3 ? 0 : index.value - 3;
    return deck.value.slice(startIndex, index.value);
});
const deckState = computed(() => {
    if (index.value === 0 && deck.value.length == 0) return 'empty';
    if (index.value === deck.value.length) return 'full';
    return 'normal';
});
</script>
<template>
    <main>
        <GameBoard>
            <div class="text">發牌區</div>
            <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap:3rem; width: fit-content;">
                <!-- 移牌區 - 左邊水平疊牌最多三張 -->
                <div style="display: grid; grid-template-columns: repeat(3, 3rem);">
                    <div v-for="card in canTakeCards" :key="card.value">
                        <Card :value="card.value" :isOpen="true" />
                    </div>
                </div>
                <!-- 發牌堆 -->
                <div class="card-box">
                    <div class="card" style="visibility: hidden;">
                        <div style="visibility: visible; width: 100%;height: 100%; ">
                            <Transition name="slide-left">
                                <div v-if="deckState == 'empty'">無牌可用</div>
                                <div v-else-if="deckState == 'full'" class="card" @click="clickCard">重新循環</div>
                                <div v-else-if="deckState == 'normal'" @click="clickCard" class="card-back"></div>
                            </Transition>
                        </div>
                    </div>
                </div>
            </div>
        </GameBoard>
    </main>
</template>

<style scoped>
.text {
    color: white;
}

.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.25s ease-out;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(60px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-60px);
}

.card-box {
    border: 3px solid yellow;
    padding: 3px;
    margin: 1px;
    /* display: flex; */
    /* flex-direction: column; */
    position: relative;
}

.card-back {
    /** 避免背圖因為padding超出框框 */
    width: 100%;
    height: 100%;
    /* 背圖 */
    background: url("@/assets/imgs/foxy01.jpg") no-repeat center;
    /* 使用 cover 屬性讓背景圖包裹在容器內 */
    background-size: cover;
}
</style>