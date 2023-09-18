<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable'
import { geneateDeck } from "../utils/poker-helper";
import GameBoard from '../components/GameBoard.vue';
import Card from '../components/Card.vue';
const firstCardStack = ref(geneateDeck(20, true));
</script>
<template>
    <main>
        <GameBoard>
            <h4 class="title">Demo1</h4>
            <draggable :list="firstCardStack" @change="console.log" itemKey="value"
                style="display: grid; grid-template-columns: repeat(13, 3rem);">
                <template #item="{ element, index }">
                    <Card :value="element.value" :isOpen="element.isOpen" />
                </template>
            </draggable>
        </GameBoard>
    </main>
</template>
<style scoped>
.title {
    color: white;
    font-size: 2rem;
    text-align: center;
}
</style>