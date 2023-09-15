<script setup>
import { ref } from 'vue';
import GameBoard from '../components/GameBoard.vue';
import CardBox from '../components/CardBox.vue';
import { geneateDeck } from "../utils/poker-helper";
const fstCards = ref(geneateDeck(5, true));
const secondCards = ref([]);
const moveCardFromAToB = () => {
  const card = fstCards.value.pop();
  if (card === undefined) return;
  secondCards.value.push(card);
};
const moveCardFromBToA = () => {
  const card = secondCards.value.pop();
  if (card === undefined) return;
  fstCards.value.push(card); s
};
</script>
<template>
  <main>
    <GameBoard>
      <h1>這裡是Home，類似遊戲大廳的地方?!</h1>
      <p>
        我打算在這裡先畫牌堆的樣子
      </p>
      <div style="display: grid;  grid-template-columns: 1fr 1fr;">
        <div>第一卡堆: </div>
        <div>第二卡堆: </div>
        <CardBox @Click="moveCardFromAToB" :cards="fstCards"></CardBox>
        <CardBox @Click="moveCardFromBToA" :cards="secondCards"></CardBox>
      </div>
    </GameBoard>
  </main>
</template>

<style scoped>
p {
  color: white;
}
</style>