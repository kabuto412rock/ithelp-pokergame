<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable'
import { geneateDeck } from "../utils/poker-helper";
import GameBoard from '../components/GameBoard.vue';
import Card from '../components/Card.vue';
const firstCardStack = ref(geneateDeck(26, true));
const secondCardStack = ref([]);
</script>
<template>
    <main>
        <GameBoard>
            <div>
                <h4 class="title">牌堆1</h4>
                <draggable :list="firstCardStack" group="pokers" @change="console.log" itemKey="value"
                    style="display: grid; grid-template-columns: repeat(13, 3rem); background-color: yellow;">
                    <template #item="{ element, index }">
                        <Card :value="element.value" :isOpen="element.isOpen" />
                    </template>
                </draggable>
            </div>
            <div>
                <h4 class="title">牌堆2</h4>
                <draggable :list="secondCardStack" group="pokers" @change="console.log" itemKey="value"
                    style="display: grid; grid-template-columns: repeat(13, 3rem); background-color: yellow;padding: 1px;">
                    <template #item="{ element, index }">
                        <Card :value="element.value" :isOpen="element.isOpen" />
                    </template>
                </draggable>
            </div>
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