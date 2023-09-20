<script setup>
import { onMounted, reactive, ref } from 'vue';
import draggable from 'vuedraggable'
import { geneateDeck } from "../utils/poker-helper";
import GameBoard from '../components/GameBoard.vue';
import Card from '../components/Card.vue';
const first = ref(null);
const second = ref(null);
const cardStacks = reactive({
    first: geneateDeck(10, true),
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
    const result = evt.from !== evt.to;
    if (result) {
        // 取得牌堆的來源、目標名稱，對應reactive`cardStacks`內的名稱
        const from = getDomName(evt.from);
        const to = getDomName(evt.to);
        console.log(`:moved from: ${from}, to: ${to}`);
        const draggedContext = evt.draggedContext
        const { index, futureIndex } = draggedContext;
        console.log(`index, futureIndex = ${index}, ${futureIndex}`);
        // 多筆拖曳後，來源牌堆、目的牌堆的陣列變動後的結果
        const newFromCards = cardStacks[from].slice(0, index);
        const newToCards = [
            ...cardStacks[to].slice(0, futureIndex),
            ...cardStacks[from].slice(index),
            ...cardStacks[to].slice(futureIndex)
        ];
        console.log(`newFromCards = ${newFromCards.map((card) => card.value).join(',')}`);
        console.log(`newToCards = ${newToCards.map((card) => card.value).join(',')}`);
        // 將變動牌堆的函數暫存，預計等到拖曳完成後執行
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