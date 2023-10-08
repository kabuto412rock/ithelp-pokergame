<script setup>
/**
 * @typedef {import('../../@types/index').Card} Card
 */
import { computed, onMounted, reactive, ref, watch } from 'vue';
import draggable from 'vuedraggable'
import { BModal } from 'bootstrap-vue-next';
import { FOUR_SUITS, PokerValuesMap, SEVEN_STACKS } from '../utils/constants';
import { geneateShuffleDeck, checkNextOk, checkNextOk2, getMoveHint, findFollowDeckName, checkSolitaireGameDone, getRemainCardCount, checkValidMove } from "../utils/poker-helper";
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
    /** @type {Card[]} */ dealerStacks: [],
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
const history = ref([]);

let dealer = reactive({ index: 0 });
let gameScore = ref(0);
const gameTime = ref(0);
const gameTimer = ref(null);
const doneModal = ref(false);
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
    cardStacks.dealerStacks = data.slice(28).map(card => ({ ...card, isOpen: true }));
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

    // 關閉結算視窗
    doneModal.value = false;
    history.value = [];
    pushStateToHistory();
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
                pushStateToHistory();
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
            cardStacks.dealerStacks = cardStacks.dealerStacks.filter(card => card.value !== dealerCard.value);
            gameScore.value += 10 + (isToFinishedArea ? 15 : 0);
            changeOption.value = null;
            pushStateToHistory();
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
            pushStateToHistory();
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
/** 顯示移牌提示 */
function showHint(e) {
    const btnElement = e.target;
    const info = getMoveHint(cardStacks, dealer.index);
    if (info) {
        const { card, toName } = info;
        const fromDom = document.querySelector('div[dcid="card' + card.value + '"]');
        let toDom;
        if (cardStacks[toName].length == 0) {
            toDom = document.querySelector('div[dcid="' + toName + '"]');
        } else {
            toDom = document.querySelector('div[dcid="card' + cardStacks[toName][cardStacks[toName].length - 1].value + '"]');
        }
        animateMoveDom(fromDom, toDom);
    } else {
        btnElement.disabled = true;
        const orginalContent = btnElement.textContent;
        btnElement.textContent = '沒有可移動的牌';

        setTimeout(() => {
            btnElement.disabled = false;
            btnElement.textContent = orginalContent;
        }, 1000);
    }
}
function animateMoveDom(element1, element2) {
    const { x, y, height } = element2.getBoundingClientRect();
    const element1Clone = element1.cloneNode(true);
    const app = document.body.querySelector("#app");
    app.appendChild(element1Clone);
    element1Clone.style.position = 'absolute';
    element1Clone.style.zIndex = 9999;
    element1Clone.style.top = Math.floor(y + height / 3) + 'px';
    element1Clone.style.boxShadow = '0 0 10px 5px limegreen';
    element1Clone.style.left = Math.floor(x) + 'px';
    element1.style.opacity = 0.5;
    setTimeout(() => {
        app.removeChild(element1Clone);
        element1.style.opacity = 1;
    }, 1000);
}


/**
 * 自動移動
 * @param {String} fromName 來自的牌堆名稱
 * @param {Card} card 想移動的牌
 */
function clickAutoMove(fromName, card) {
    const toNames = findFollowDeckName(cardStacks, card);
    // 如果沒找到對應牌堆，則不執行
    if (toNames.length == 0) {
        console.log(`卡牌${PokerValuesMap[card.value].content}沒有符合移動的規則`);
        return;
    }
    let toName = toNames.find((name) => FOUR_SUITS.includes(name)) ?? toNames[0];
    if (fromName == 'dealerStacks') {
        console.log(`可移動至的牌堆有: ${toNames}, 選擇移動至: ${toName}`);
        // 來自`發牌堆`
        const fromIndex = cardStacks[fromName].findIndex(c => c.value == card.value);

        const newFromCards = [
            ...cardStacks[fromName].slice(0, fromIndex),
            ...cardStacks[fromName].slice(fromIndex + 1)
        ];
        const newToCards = [
            ...cardStacks[toName],
            cardStacks[fromName][fromIndex]
        ];
        cardStacks[fromName] = newFromCards;
        cardStacks[toName] = newToCards;
        gameScore.value += FOUR_SUITS.includes(toName) ? 25 : 10;
        return pushStateToHistory();
    } else if (SEVEN_STACKS.includes(fromName)) {
        // 來自7牌堆
        const fromLength = cardStacks[fromName].length;
        const fromIndex = cardStacks[fromName].findIndex(c => c.value == card.value);
        if (FOUR_SUITS.includes(toName) && fromIndex === (fromLength - 1)) {
            const newFromCards = cardStacks[fromName].slice(0, fromIndex);
            const newToCards = [
                ...cardStacks[toName],
                card
            ];
            cardStacks[fromName] = newFromCards;
            cardStacks[toName] = newToCards;
            gameScore.value += 15;
            return pushStateToHistory();
        }
        toName = toNames.find((name) => SEVEN_STACKS.includes(name));
        if (toName) {
            const newFromCards = cardStacks[fromName].slice(0, fromIndex);
            const newToCards = [
                ...cardStacks[toName],
                ...cardStacks[fromName].slice(fromIndex)
            ];
            cardStacks[fromName] = newFromCards;
            cardStacks[toName] = newToCards;
            return pushStateToHistory();
        }
    }
}

watch(cardStacks, (newCardStacks) => {
    const isDone = checkSolitaireGameDone(newCardStacks);
    if (isDone) {
        doneModal.value = true;
    }
})
watch(doneModal, (newValue, oldValue) => {
    if (newValue) {
        clearInterval(gameTimer.value);
    }
});
// 發牌區、七牌堆的剩餘牌數
const remainCardCounts = computed(() => {
    const { dealer, seven } = getRemainCardCount(cardStacks);
    return { dealer, seven };
});
// 是否有可移動的牌(推測)
const maybeHaveValidMove = computed(() => checkValidMove(cardStacks));

/** 儲存當前狀態到歷史紀錄 */
function pushStateToHistory() {
    if (history.value.length > 30) {
        const startIndex = history.value.length - 30;
        history.value = history.value.slice(startIndex, history.value.length);
    }
    const elemFunc = (card) => ({
        "value": card.value,
        "isOpen": card.isOpen,
        "isDone": card.isDone,
    });
    history.value = [
        ...history.value,
        {
            "cardStacks": {
                first: cardStacks.first.slice().map(elemFunc),
                second: cardStacks.second.slice().map(elemFunc),
                third: cardStacks.third.slice().map(elemFunc),
                fourth: cardStacks.fourth.slice().map(elemFunc),
                fifth: cardStacks.fifth.slice().map(elemFunc),
                sixth: cardStacks.sixth.slice().map(elemFunc),
                seventh: cardStacks.seventh.slice().map(elemFunc),
                dealerStacks: cardStacks.dealerStacks.slice().map(elemFunc),
                club: cardStacks.club.slice().map(elemFunc),
                diamond: cardStacks.diamond.slice().map(elemFunc),
                heart: cardStacks.heart.slice().map(elemFunc),
                spade: cardStacks.spade.slice().map(elemFunc),
            },
            "gameScore": JSON.parse(JSON.stringify(gameScore.value)),
            "dealer": { index: dealer.index },
        }
    ];
}
/** 返回上一步 */
function undo() {
    if (history.value.length > 1) {
        const prevHistory = history.value.slice(0, history.value.length - 1);
        history.value = prevHistory;
        const prevState = prevHistory[prevHistory.length - 1];
        cardStacks.dealerStacks = prevState.cardStacks.dealerStacks;
        FOUR_SUITS.forEach((deckName) => {
            cardStacks[deckName] = prevState.cardStacks[deckName];
        })
        SEVEN_STACKS.forEach((deckName) => {
            cardStacks[deckName] = prevState.cardStacks[deckName];
        })
        gameScore.value = prevState.gameScore;
        dealer = prevState.dealer;
    }
}

</script>
<template>
    <main>
        <BModal v-model="doneModal" title="結算畫面" hide-footer @close="resetGame" @hide="resetGame">
            <h1>玩家 xxx</h1>
            <div>完成花費時間: {{ gameTime }} 秒</div>
            <div>累計分數: {{ gameScore }} 分</div>
            <div>發牌區剩餘 {{ remainCardCounts.dealer }} 張 x 35分</div>
            <div>7牌堆剩餘 {{ remainCardCounts.seven }} 張 x 20分</div>
            <div>加權總分: {{ gameScore + remainCardCounts.dealer * 35 + remainCardCounts.seven * 20 }} 分</div>
        </BModal>
        <div
            style=" display: flex; flex-wrap: wrap; flex-direction: row;justify-content: space-around; align-items: center;  background-color: antiquewhite; font-size: large;">
            <div>
                累計分數: {{ gameScore }}
            </div>
            <div>
                經過時間: {{ gameTime }} 秒
            </div>
            <span>
                <button style="font-size: 1.5rem;" @click="resetGame">重置</button>
                <button style="font-size: 1.5rem;" @click="(e) => showHint(e)">提示</button>
                <button style="font-size: 1.5rem;" @click="undo">上一步</button>
                <span>
                    {{ maybeHaveValidMove ? '(遊戲還有解)' : '(可能無解😎)' }}
                </span>
            </span>
        </div>
        <GameBoard style="display: flex; position: relative;" @click="startTimer">
            <div>
                <div class="text">發牌區</div>
                <DealerArea :dealer="dealer" :deck="cardStacks.dealerStacks" :moveCard="dealerMove"
                    @idx="v => { dealer.index = v; pushStateToHistory(); }"
                    @card-click="(card) => clickAutoMove('dealerStacks', card)" />
                <div class="text">結算牌堆</div>
                <FinishedArea :fourCards="cardStacks" :moveCard="finishedCardMove" @doms="setFourCardDoms"
                    :change="cardChange" />
            </div>
            <div style="display: grid;grid-template-columns: repeat(7, 1fr); overflow:fit-content;">
                <div dcid="first">
                    <draggable :list="cardStacks.first" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="first">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.first, element)" @dblclick="clickAutoMove('first', element)" />
                        </template>
                    </draggable>
                </div>
                <div dcid="second">
                    <draggable :list="cardStacks.second" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="second">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.second, element)"
                                @dblclick="clickAutoMove('second', element)" />
                        </template>
                    </draggable>
                </div>
                <div dcid="third">
                    <draggable :list="cardStacks.third" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="third">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.third, element)" @dblclick="clickAutoMove('third', element)" />
                        </template>
                    </draggable>
                </div>
                <div dcid="fourth">
                    <draggable :list="cardStacks.fourth" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="fourth">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.fourth, element)"
                                @dblclick="clickAutoMove('fourth', element)" />
                        </template>
                    </draggable>
                </div>
                <div dcid="fifth">
                    <draggable :list="cardStacks.fifth" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="fifth">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.fifth, element)" @dblclick="clickAutoMove('fifth', element)" />
                        </template>
                    </draggable>
                </div>

                <div dcid="sixth">
                    <draggable :list="cardStacks.sixth" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="sixth">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.sixth, element)" @dblclick="clickAutoMove('sixth', element)" />
                        </template>
                    </draggable>
                </div>
                <div dcid="seventh">
                    <draggable :list="cardStacks.seventh" group="pokers" itemKey="value" class="drag-cards"
                        :move="limitLocalMove" @change="cardChange" ref="seventh">
                        <template #item="{ element, index }">
                            <Card :value="element.value" :isOpen="element.isOpen"
                                @click="openCard(cardStacks.seventh, element)"
                                @dblclick="clickAutoMove('seventh', element)" />
                        </template>
                    </draggable>
                </div>
            </div>
        </GameBoard>
        <div>
            <div>
                <table class="table">
                    <thead>
                        <tr>
                            <th>牌堆</th>
                            <th>蓋牌</th>
                            <th>開牌</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>first</td>
                            <td>{{ cardStacks.first.filter(a => !a.isOpen).map(a => PokerValuesMap[a.value].content) }}</td>
                            <td>{{ cardStacks.first.filter(a => a.isOpen).map(a => PokerValuesMap[a.value].content) }}</td>
                        </tr>
                        <tr>
                            <td>second</td>
                            <td>{{ cardStacks.second.filter(a => !a.isOpen).map(a => PokerValuesMap[a.value].content) }}
                            </td>
                            <td>{{ cardStacks.second.filter(a => a.isOpen).map(a => PokerValuesMap[a.value].content) }}</td>
                        </tr>
                        <tr>
                            <td>third</td>
                            <td>{{ cardStacks.third.filter(a => !a.isOpen).map(a => PokerValuesMap[a.value].content) }}
                            </td>
                            <td>{{ cardStacks.third.filter(a => a.isOpen).map(a => PokerValuesMap[a.value].content) }}</td>
                        </tr>
                        <tr>
                            <td>fourth</td>
                            <td>{{ cardStacks.fourth.filter(a => !a.isOpen).map(a => PokerValuesMap[a.value].content) }}
                            </td>
                            <td>{{ cardStacks.fourth.filter(a => a.isOpen).map(a => PokerValuesMap[a.value].content) }}</td>
                        </tr>
                        <tr>
                            <td>fifth</td>
                            <td>{{ cardStacks.fifth.filter(a => !a.isOpen).map(a => PokerValuesMap[a.value].content) }}
                            </td>
                            <td>{{ cardStacks.fifth.filter(a => a.isOpen).map(a => PokerValuesMap[a.value].content) }}</td>
                        </tr>
                        <tr>
                            <td>sixth</td>
                            <td>{{ cardStacks.sixth.filter(a => !a.isOpen).map(a => PokerValuesMap[a.value].content) }}
                            </td>
                            <td>{{ cardStacks.sixth.filter(a => a.isOpen).map(a => PokerValuesMap[a.value].content) }}</td>
                        </tr>
                        <tr>
                            <td>seventh</td>
                            <td>{{ cardStacks.seventh.filter(a => !a.isOpen).map(a => PokerValuesMap[a.value].content) }}
                            </td>
                            <td>{{ cardStacks.seventh.filter(a => a.isOpen).map(a => PokerValuesMap[a.value].content) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
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