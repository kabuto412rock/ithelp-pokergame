<script setup>
import FoxyHeader from './components/FoxyHeader.vue'
import GameBoard from './components/GameBoard.vue'
</script>

<template>
  <header>
  </header>
  <main>
    <FoxyHeader />
    <GameBoard />
  </main>
</template>

<style scoped>
main {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
}
</style>
