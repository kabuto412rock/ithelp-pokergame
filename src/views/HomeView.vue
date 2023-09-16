<script setup>
import { ref } from 'vue';
import GameBoard from '../components/GameBoard.vue';
import CardBox from '../components/CardBox.vue';
import { geneateDeck } from "../utils/poker-helper";
import CardColumn from '../components/CardColumn.vue';
const fstCards = ref(geneateDeck(13, true));
const secondCards = ref([]);
const moveCardFromAToB = () => {
  const card = fstCards.value.pop();
  if (card === undefined) return;
  secondCards.value.push(card);
};
const moveCardFromBToA = () => {
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
        <CardColumn :onClick="moveCardFromAToB" :cards="fstCards"></CardColumn>
        <CardColumn :onClick="moveCardFromBToA" :cards="secondCards"></CardColumn>
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