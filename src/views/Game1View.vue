<script setup>
import FoxyHeader from '../components/FoxyHeader.vue'
import GameBoard from '../components/GameBoard.vue'

</script>
<template setup>
    <main>
        <FoxyHeader>撲克牌連連看</FoxyHeader>
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