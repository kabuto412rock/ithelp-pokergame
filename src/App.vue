<script setup>
import FoxyHeader from './components/FoxyHeader.vue'
import GameBoard from './components/GameBoard.vue'
</script>

<template>
  <FoxyHeader />
  <main>
    <GameBoard />
  </main>
</template>

<style scoped>
main {
  width: 100%;
  margin: 0 auto;
  border: 3px solid black;
}
</style>
