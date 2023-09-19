<script setup>
import { ref } from 'vue';
import draggable from 'vuedraggable'
import { geneateDeck } from "../utils/poker-helper";
import GameBoard from '../components/GameBoard.vue';
import Card from '../components/Card.vue';
const firstCardStack = ref(geneateDeck(26, true));
const secondCardStack = ref([]);

function limitLocalMove(evt, originalEvent) {
    // 限制同個牌堆無法拖曳
    return evt.from !== evt.to;
}
</script>
<template>
    <main>
        <GameBoard>
            <div>
                <h4 class="title">牌堆1</h4>
                <draggable :list="firstCardStack" group="pokers" itemKey="value"
                    style="display: grid; grid-template-columns: repeat(13, 3rem); background-color: yellow;"
                    :move="limitLocalMove">
                    <template #item="{ element, index }">
                        <Card :value="element.value" :isOpen="element.isOpen" />
                    </template>
                </draggable>
            </div>
            <div>
                <h4 class="title">牌堆2</h4>
                <draggable :list="secondCardStack" group="pokers" itemKey="value"
                    style="display: grid; grid-template-columns: repeat(13, 3rem); background-color: yellow;padding: 1px;"
                    :move="limitLocalMove">
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