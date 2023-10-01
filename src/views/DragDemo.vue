<script setup>
/**
 * @typedef {import('../../@types/index').Card} Card
 */
import { onMounted, reactive, ref, watch } from 'vue';
import draggable from 'vuedraggable'
import { FOUR_SUITS, SEVEN_STACKS } from '../utils/constants';
import { geneateShuffleDeck, checkNextOk, checkNextOk2, findTailCards } from "../utils/poker-helper";
import GameBoard from '../components/GameBoard.vue';
import Card from '../components/Card.vue';
import DealerArea from '../components/DealerArea.vue';
import FinishedArea from '../components/FinishedArea.vue';
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
     /** @type {Card[]} */ club: [],
     /** @type {Card[]} */ diamond: [],
     /** @type {Card[]} */ heart: [],
     /** @type {Card[]} */ spade: [],
});
const fourCardsDom = reactive({
    club: null,
    diamond: null,
    heart: null,
    spade: null,
});
let dealer = reactive({ index: 0 });
let gameScore = ref(0);
const gameTime = ref(0);
const gameTimer = ref(null);

onMounted(() => {
    resetGame();
});

watch(cardStacks, (stacks) => {
    // 檢查每組牌堆最後一張
    SEVEN_STACKS.forEach(cardName => {
        if (stacks[cardName].length > 0) {
            const lastCard = stacks[cardName][stacks[cardName].length - 1];
            if (!lastCard.isOpen) {
                lastCard.isOpen = true;
                gameScore.value += 5;
            }
        }
    });
});
const changeOption = ref(null);

function resetGame() {
    const data = geneateShuffleDeck(52); // 洗亂的52張牌
    const everyIndex = [0, 1, 3, 6, 10, 15, 21, 28]// 7牌堆每個牌堆的起始index
    SEVEN_STACKS.forEach((name, idx) => {
        let cards = data.slice(everyIndex[idx], everyIndex[idx + 1]);
        cards[cards.length - 1].isOpen = true;
        cardStacks[name] = cards;
    });
    // 發牌區
    cardStacks.delaerStacks = data.slice(28).map(card => ({ ...card, isOpen: true }));
    // 結算牌堆區
    FOUR_SUITS.forEach(name => {
        cardStacks[name] = [];
    });
    dealer = { index: 0 };
    // 初始化遊戲分數、時間
    gameScore.value = 0;
    gameTime.value = 0;
    clearInterval(gameTimer.value);
    gameTimer.value = null;
}
function setFourCardDoms(cardDomMaps) {
    FOUR_SUITS.forEach(name => {
        const domElement = cardDomMaps[name];
        fourCardsDom[name] = domElement;
    });
}
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
        for (let i = 0; i < FOUR_SUITS.length; i++) {
            const name = FOUR_SUITS[i];
            if (dom == fourCardsDom[name]) {
                return name;
            }
        }
        return 'none';
    }
}
/** 7牌堆移動 */
function limitLocalMove(evt) {
    // 限制同個牌堆無法拖曳
    let result = evt.from !== evt.to;

    // 取得牌堆的來源、目標名稱，對應reactive`cardStacks`內的名稱
    const from = getDomName(evt.from);
    const to = getDomName(evt.to);
    const { index, futureIndex, element } = evt.draggedContext;

    // 移動的牌必須是開著的
    result = result && cardStacks[from][index].isOpen;

    const isToFinishedArea = FOUR_SUITS.includes(to);
    if (isToFinishedArea) {
        // 只能移動單張牌至結算牌堆
        result = result && cardStacks[from].length - 1 == index;
        result = result && checkNextOk2(to, cardStacks, element);
    } else {
        // 只能移動至目標牌堆的最後一張牌
        result = result && futureIndex == cardStacks[to].length;
        // 檢查疊牌順序、花色是否正確
        result = result && checkNextOk(cardStacks[to], element);
    }

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
            cardStacks[to] = isToFinishedArea ? newToCards.sort((a, b) => a.value - b.value) : newToCards;
            if (isToFinishedArea) {
                gameScore.value += 15;
            }
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
    const { futureIndex } = evt.draggedContext;
    let result = true;

    // 如果目標是結算盤堆，則套用結算盤堆的規則
    const isToFinishedArea = FOUR_SUITS.includes(to);

    // 只能移動至目標牌堆的最後一張牌
    result = result && futureIndex == cardStacks[to].length;

    if (isToFinishedArea) {
        result = result && checkNextOk2(to, cardStacks, dealerCard);
    } else {
        // 檢查疊牌順序、花色是否正確
        result = result && checkNextOk(cardStacks[to], dealerCard);
    }
    if (result) {
        changeOption.value = () => {
            cardStacks.delaerStacks = cardStacks.delaerStacks.filter(card => card.value !== dealerCard.value);
            gameScore.value += 10 + (isToFinishedArea ? 15 : 0);
            changeOption.value = null;
        };
    }
    return result;
}
/** 結算牌堆移動 */
function finishedCardMove(evt) {
    const to = getDomName(evt.to);

    let result = SEVEN_STACKS.includes(to);
    console.log(`結算牌堆移動to: ${to}, result: ${result}`);
    const { futureIndex, element } = evt.draggedContext;
    // 只能移動至目標牌堆的最後一張牌
    result = result && futureIndex == cardStacks[to].length;

    // 檢查疊牌順序、花色是否正確
    result = result && checkNextOk(cardStacks[to], element);

    if (result) {
        changeOption.value = () => {
            gameScore.value -= 15;
            changeOption.value = null;
        };
    }
    return result;
}
function cardChange(event) {
    // 當卡片變動時，若有執行變動牌堆的陣列函數
    if (changeOption.value) {
        changeOption.value();
    } else {
        console.log(`no trigger changeOption`);
    };
    changeOption.value = null;
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
/** 開始計時 */
function startTimer() {
    if (!gameTimer.value) {
        gameTimer.value = setInterval(() => {
            gameTime.value++;
        }, 1000);
    }
}
</script>
<template>
    <main>
        <div
            style=" display: flex; flex-wrap: wrap; flex-direction: row;justify-content: space-around; align-items: center;  background-color: antiquewhite; font-size: large;">
            <div>
                累計分數: {{ gameScore }}
            </div>
            <div>
                經過時間: {{ gameTime }} 秒
            </div>
            <button style="font-size: 1.5rem;" @click="resetGame">重置</button>
            <button @click="() => console.log(findTailCards(cardStacks))">提示</button>
        </div>
        <GameBoard style="display: flex;" @click="startTimer">
            <div>
                <div class="text">發牌區</div>
                <DealerArea :dealer="dealer" :deck="cardStacks.delaerStacks" :moveCard="dealerMove" />
                <div class="text">結算牌堆</div>
                <FinishedArea :fourCards="cardStacks" :moveCard="finishedCardMove" @doms="setFourCardDoms"
                    :change="cardChange" />
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
    grid-template-rows: repeat(13, 2.5rem);
    background-color: yellow;
    border: 1px solid black;
    min-height: 2px;
    padding: 1px;
}

.text {
    color: white;
}
</style>