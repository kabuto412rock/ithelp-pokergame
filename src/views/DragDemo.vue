<script setup>
import { onMounted, reactive, ref } from 'vue';
import draggable from 'vuedraggable'
import { geneateDeck } from "../utils/poker-helper";
import GameBoard from '../components/GameBoard.vue';
import Card from '../components/Card.vue';
const first = ref(null);
const second = ref(null);
const cardStacks = reactive({
    first: geneateDeck(13, true),
    second: [],
    none: []
});
const changeOption = ref(null);
function getDomName(dom) {
    if (dom == first.value.targetDomElement) {
        return 'first';
    } else if (dom == second.value.targetDomElement) {
        return 'second';
    } else {
        return 'none';
    }
}
function limitLocalMove(evt) {
    // 限制同個牌堆無法拖曳
    let result = evt.from !== evt.to;

    // 取得牌堆的來源、目標名稱，對應reactive`cardStacks`內的名稱
    const from = getDomName(evt.from);
    const to = getDomName(evt.to);
    const { index, futureIndex } = evt.draggedContext;

    // 只能移動目標牌堆的最後一張牌
    result = result && futureIndex == cardStacks[to].length;

    if (result) {
        // 多筆拖曳後，來源牌堆、目的牌堆的陣列變動後的結果
        const newFromCards = cardStacks[from].slice(0, index);
        const newToCards = [
            ...cardStacks[to].slice(0, futureIndex),
            ...cardStacks[from].slice(index),
            ...cardStacks[to].slice(futureIndex)
        ];
        changeOption.value = () => {
            cardStacks[from] = newFromCards;
            cardStacks[to] = newToCards;
            changeOption.value = null;
        };
    }
    // 仍使用原生的拖曳效果
    return result;
}

function cardChange(event) {
    // 當卡片變動時，若有執行變動牌堆的陣列函數
    if (changeOption.value) {
        changeOption.value();
        changeOption.value = null;
    } else {
        console.log(`no trigger changeOption`);
    };
}
</script>
<template>
    <main>
        <GameBoard>
            <div>
                <h4 class="title">牌堆1</h4>
                <draggable :list="cardStacks.first" group="pokers" itemKey="value"
                    style="display: grid; grid-template-columns: repeat(13, 3rem); background-color: yellow;"
                    :move="limitLocalMove" @change="cardChange" ref="first">
                    <template #item="{ element, index }">
                        <Card :value="element.value" :isOpen="element.isOpen" />
                    </template>
                </draggable>
            </div>
            <div>
                <h4 class="title">牌堆2</h4>
                <draggable :list="cardStacks.second" group="pokers" itemKey="value"
                    style="display: grid; grid-template-columns: repeat(13, 3rem); background-color: yellow;padding: 1px;"
                    :move="limitLocalMove" @change="cardChange" ref="second">
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

.draggable {
    cursor: move;
}

.selected {
    background-color: #ccc;
}
</style>