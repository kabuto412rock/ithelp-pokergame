<script setup>


import { ref } from 'vue';
import GameBoard from '../components/GameBoard.vue';
import CardBox from '../components/CardBox.vue';
import { geneateDeck, getPosition } from "../utils/poker-helper";
import CardColumn from '../components/CardColumn.vue';
const fstCards = ref(geneateDeck(13, true));
const secondCards = ref([]);
// 第1, 2個卡堆的位置
const fstCardsPos = ref({ x: 0, y: 0 });
const secondCardsPos = ref({ x: 0, y: 0 });
// 

const moveCardFromAToB = (target) => {
  const { x, y } = getPosition(target);
  console.log(`A to B target: x: ${x}, y: ${y}`);
  console.log(`A: ${fstCardsPos.value.x}, ${fstCardsPos.value.y}`);
  const card = fstCards.value.pop();
  if (card === undefined) return;

  const moveX = Math.floor(secondCardsPos.value.x - fstCardsPos.value.x);
  const moveY = Math.floor(secondCardsPos.value.y - fstCardsPos.value.y);

  secondCards.value.push(card);
};
const moveCardFromBToA = (target) => {
  const card = secondCards.value.pop();
  if (card === undefined) return;
  fstCards.value.push(card);
};
</script>
<template>
  <main>

    <GameBoard>
      <div style="display: grid;  grid-template-columns: 1fr 1fr 1fr 1fr;">
        <div>第1卡堆: </div>
        <div>第2卡堆: </div>
        <div>第1卡堆: </div>
        <div>第2卡堆: </div>
        <CardBox @Click="moveCardFromAToB" :cards="fstCards"></CardBox>
        <CardBox @Click="moveCardFromBToA" :cards="secondCards"></CardBox>
        <CardColumn :onClick="moveCardFromAToB" :cards="fstCards" @position="(pos) => fstCardsPos = pos"></CardColumn>
        <CardColumn :onClick="moveCardFromBToA" :cards="secondCards" @position="(pos) => secondCardsPos = pos">
        </CardColumn>
      </div>
      <h1>這裡是Home，類似遊戲大廳的地方?!</h1>
      <p>
        我打算在這裡測試牌堆
      </p>
    </GameBoard>
  </main>
</template>

<style scoped>
p {
  color: white;
}
</style>