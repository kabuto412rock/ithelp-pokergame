<script setup>
import { onMounted, ref } from 'vue';
import GameBoard from '../components/GameBoard.vue';
import { geneateDeck } from '../utils/poker-helper';
import DealerArea from '../components/DealerArea.vue';
import FinishedArea from '../components/FinishedArea.vue';
const deck = ref([]);

onMounted(() => {
    deck.value = geneateDeck(14, true);
})
</script>
<template>
    <main>
        <GameBoard>
            <div class="text">發牌區</div>
            <DealerArea :deck="deck" />
            <div class="text">結算牌堆</div>
            <FinishedArea />
        </GameBoard>
    </main>
</template>

<style scoped>
.text {
    color: white;
}
</style>