<script setup>
/**
 * @typedef {import('../../@types/index').Card} Card
 */
import { onMounted, reactive, ref, watch } from 'vue';
import draggable from 'vuedraggable'
import { geneateShuffleDeck, checkNextOk, geneateDeck } from "../utils/poker-helper";
import GameBoard from '../components/GameBoard.vue';
import Card from '../components/Card.vue';
import DealerArea from '../components/DealerArea.vue';
const first = ref(null);
const second = ref(null);
const third = ref(null);
const fourth = ref(null);
const fifth = ref(null);
const sixth = ref(null);
const seventh = ref(null);
const cardStacks = reactive({
    /** @type {Card[]} */ first: [],
    /** @type {Card[]} */ second: [],
    /** @type {Card[]} */ third: [],
    /** @type {Card[]} */ fourth: [],
    /** @type {Card[]} */ fifth: [],
    /** @type {Card[]} */ sixth: [],
    /** @type {Card[]} */ seventh: [],
    /** @type {Card[]} */ none: [],
    /** @type {Card[]} */ delaerStacks: [],
});
const validNames = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh'];
onMounted(() => {
    const data = geneateShuffleDeck(52); // 梅花A~黑桃K
    const everyIndex = [0, 1, 3, 6, 10, 15, 21, 28]// // 梅花A~紅心2
    validNames.forEach((name, idx) => {
        cardStacks[name] = data.slice(everyIndex[idx], everyIndex[idx + 1]);
    });
    cardStacks.delaerStacks = data.slice(28).map(card => ({ ...card, isOpen: true }));
});

watch(cardStacks, (stacks) => {
    // 檢查每組牌堆最後一張
    validNames.forEach(cardName => {
        if (stacks[cardName].length > 0) {
            const lastCard = stacks[cardName][stacks[cardName].length - 1];
            lastCard.isOpen = true;
        }
    });
});
const changeOption = ref(null);
function getDomName(dom) {
    if (dom == first.value.targetDomElement) {
        return 'first';
    } else if (dom == second.value.targetDomElement) {
        return 'second';
    } else if (dom == third.value.targetDomElement) {
        return 'third';
    } else if (dom == fourth.value.targetDomElement) {
        return 'fourth';
    } else if (dom == fifth.value.targetDomElement) {
        return 'fifth';
    } else if (dom == sixth.value.targetDomElement) {
        return 'sixth';
    } else if (dom == seventh.value.targetDomElement) {
        return 'seventh';
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

    // 只能移動至目標牌堆的最後一張牌
    result = result && futureIndex == cardStacks[to].length;

    // 移動的牌必須是開著的
    result = result && cardStacks[from][index].isOpen;

    // 檢查疊牌順序、花色是否正確
    result = result && checkNextOk(cardStacks[to], cardStacks[from][index]);

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
/** 發牌區移動 */
function dealerMove(evt) {
    const to = getDomName(evt.to);
    const dealerCard = evt.draggedContext.element;

    // 檢查疊牌順序、花色是否正確
    const result = checkNextOk(cardStacks[to], dealerCard);
    if (result) {
        changeOption.value = () => {
            cardStacks.delaerStacks = cardStacks.delaerStacks.filter(card => card.value !== dealerCard.value);
            changeOption.value = null;
        };
    }
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
/** 開牌函數 
 * @param {Card[]} cards 
 * @param {Card} element 
 */
function openCard(cards, element) {
    let same = cards[cards.length - 1].value == element.value;
    if (same) {
        element.isOpen = true;
    }
}
</script>
<template>
    <main>
        <GameBoard style="display: flex;">
            <div>
                <DealerArea :deck="cardStacks.delaerStacks" :moveCard="dealerMove" />
            </div>
            <div style="display: grid;grid-template-columns: repeat(7, 1fr); overflow:fit-content;">
                <div>
                    <draggable :list="cardStacks.first" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="first">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.first, element)" />
                        </template>
                    </draggable>
                </div>
                <div>
                    <draggable :list="cardStacks.second" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="second">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.second, element)" />
                        </template>
                    </draggable>
                </div>
                <div>
                    <draggable :list="cardStacks.third" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="third">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.third, element)" />
                        </template>
                    </draggable>
                </div>
                <div>
                    <draggable :list="cardStacks.fourth" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="fourth">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.fourth, element)" />
                        </template>
                    </draggable>
                </div>
                <div>
                    <draggable :list="cardStacks.fifth" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="fifth">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.fifth, element)" />
                        </template>
                    </draggable>
                </div>

                <div>
                    <draggable :list="cardStacks.sixth" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="sixth">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.sixth, element)" />
                        </template>
                    </draggable>
                </div>
                <div>
                    <draggable :list="cardStacks.seventh" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="seventh">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.seventh, element)" />
                        </template>
                    </draggable>
                </div>
            </div>
        </GameBoard>
    </main>
</template>
<style scoped>
.title {
    color: white;
    font-size: 2rem;
    text-align: center;
    width: fit-content;
}

.draggable {
    cursor: move;
}

.selected {
    background-color: #ccc;
}

.drag-cards {
    display: grid;
    grid-template-rows: repeat(13, 3rem);
    background-color: yellow;
    border: 1px solid black;
    min-height: 2px;
    padding: 1px;
}
</style>