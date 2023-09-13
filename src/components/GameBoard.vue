<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { geneateShuffleDeck } from "../utils/poker-helper";
import Card from "./Card.vue";

const boardCards = ref(geneateShuffleDeck());
const gameScore = ref(0);
const game = reactive({
    timer: 0,
    timerInterval: null,
    deckCards: [],
    result: '進行中',
})

function resetGame() {
    boardCards.value = geneateShuffleDeck();
    gameScore.value = 0;
    game.deckCards = [];
    clearInterval(game.timerInterval);
    game.timerInterval = null;
    game.timer = 0;
}
function toggleFlip(num) {
    // 當開始翻牌才開始計時
    if (game.timerInterval == null) {
        game.timerInterval = setInterval(() => {
            game.timer++;
        }, 1000);
    }
    // 找到點到的牌
    const targetIdx = boardCards.value.findIndex((item) => item.value === num)
    const currentCard = boardCards.value[targetIdx]


    // 已經翻開的牌，蓋回去
    if (currentCard.isOpen) {
        currentCard.isOpen = false;
        game.deckCards = game.deckCards.filter((item) => item.value !== num);
        return;
    }
    // 翻開超過 6 張牌，全蓋回去
    if (game.deckCards.length > 5) {
        game.deckCards.forEach((deckItem) => {
            const targetIdx = boardCards.value.findIndex((item) => item.value === deckItem.value)
            boardCards.value[targetIdx].isOpen = false;
        })
        game.deckCards = [];
        return;
    }
    // 當 boardCards 改變時，檢查是否有相同牌翻開
    const sameIndex = game.deckCards.findIndex((item) => item.value % 13 === currentCard.value % 13);
    if (sameIndex != -1) {
        gameScore.value += currentCard.value % 13 + 1;
        game.deckCards[sameIndex].isDone = true;

        // 將相同的牌數字的卡從 累積卡區 移除
        game.deckCards.splice(sameIndex, 1);
        // 將相同牌從 boardCards 移除
        currentCard.isDone = true;
    } else {
        currentCard.isOpen = true;
        game.deckCards.push(currentCard);
    }

}
const timerFormat = computed(() => {
    const min = Math.floor(game.timer / 60);
    const sec = game.timer % 60;
    return `${min}分${sec}秒`;
});
watch(gameScore, (newScore, oldScore) => {
    if (newScore >= 182) {
        alert(`遊戲結束，花費時間: ${timerFormat.value} 總分數: ${newScore}!!!`);
        resetGame();
    }
});
</script>
<template>
    <button style="font-size: 1.5rem;" @click="resetGame">重置</button>
    <div style="font-size:1.5rem;">
        <div>當前分數: {{ gameScore }}</div>
        <div>時間經過: {{ timerFormat }}</div>
    </div>
    <div class="game-board">
        <div class="card-row">
            <Card v-for="card in boardCards" :key="card.value" :value="card.value" :isOpen="card.isOpen"
                :isDone="card.isDone" @poker-flip="toggleFlip" />
        </div>
    </div>
</template>

<style scoped>
div.game-board {
    min-width: 90%;
    width: auto;
    min-height: 600px;
    margin: 2px auto;
    background-color: #009933;
    border: 2px solid #000;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.card-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* ignore */
}
</style>