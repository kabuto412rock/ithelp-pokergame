<script setup>
import GameBoard from '../components/GameBoard.vue';
import CardBox from '../components/CardBox.vue';
import Card from '../components/Card.vue';

</script>
<template>
  <main>
    <GameBoard>
      <h1>這裡是Home，類似遊戲大廳的地方?!</h1>
      <p>
        我打算在這裡先畫牌堆的樣子
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr;">
        <CardBox></CardBox>
        <CardBox></CardBox>
      </div>
    </GameBoard>
  </main>
</template>

<style scoped>
p {
  color: white;
}
</style>