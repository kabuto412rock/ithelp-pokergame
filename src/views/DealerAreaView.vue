<script setup>
/**
 * @typedef {import('../../@types/index').Card} Card
 */
import { onMounted, ref, reactive } from 'vue';
import GameBoard from '../components/GameBoard.vue';
import { geneateDeck } from '../utils/poker-helper';
import DealerArea from '../components/DealerArea.vue';
import FinishedArea from '../components/FinishedArea.vue';
const FOUR_SUITS = Object.freeze(['club', 'diamond', 'heart', 'spade']);
const deck = ref([]);
const fourCards = reactive({
    club: [],
    diamond: [],
    heart: [],
    spade: []
});
const fourCardsDom = reactive({
    club: null,
    diamond: null,
    heart: null,
    spade: null,
});
let changeOption = ref(null);
onMounted(() => {
    const cards = geneateDeck(52, true);
    // 設定發牌區的初始牌
    deck.value = [...cards.slice(1, 13), ...cards.slice(14, 26), ...cards.slice(27, 39), ...cards.slice(40, 52)];

    // 設定結算牌堆的初始牌
    fourCards.club = cards.slice(0, 1);
    fourCards.diamond = cards.slice(13, 14);
    fourCards.heart = cards.slice(26, 27);
    fourCards.spade = cards.slice(39, 40);
})
function setFourCardDoms(cardDomMaps) {
    FOUR_SUITS.forEach(name => {
        const domElement = cardDomMaps[name];
        fourCardsDom[name] = domElement;
    });
}
/** 將發牌區的牌拖曳至 結算牌堆 中 */
function moveInFourCards(evt) {
    console.log(evt);
    const { element, index } = evt.draggedContext;

    // 檢查是否拖曳至 結算牌堆
    const { to } = evt;
    let deckColor = null;
    FOUR_SUITS.forEach(name => {
        if (fourCardsDom[name] === to) {
            deckColor = name;
        }
    });
    let result = deckColor != null;
    result = result && checkNextOk2(deckColor, element);
    if (result) {
        const fromCards = deck.value.filter((card) => card.value != element.value)
        const toCards = [...fourCards[deckColor], element];
        changeOption.value = () => {
            deck.value = fromCards;
            fourCards[deckColor] = toCards;
            changeOption.value = null;
        };
    }
    return result;
}
/** 檢查下一張牌是否可以放上去`集牌堆`
 * @param {String} pokerColor 牌堆花色
 * @param {Card} card 要放上去的牌
 * 
 * @returns {Boolean} 是否可以放上去
 */
function checkNextOk2(pokerColor, card) {
    const pokerColorIndex = Math.floor(card.value / 13);
    const pokerNumber = card.value % 13;
    const pokerColorName = FOUR_SUITS[pokerColorIndex];

    if (pokerColorName !== pokerColor) {
        return false;
    }
    const deckCards = fourCards[pokerColor];
    if (deckCards.length === 0 && pokerNumber !== 0) {
        return false;
    }

    const lastCardNumber = deckCards[deckCards.length - 1].value % 13;
    return lastCardNumber + 1 === pokerNumber;
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

</script>
<template>
    <main>
        <GameBoard>
            <div class="text">發牌區</div>
            <DealerArea :deck="deck" :moveCard="moveInFourCards" />
            <div class="text">結算牌堆</div>
            <FinishedArea :fourCards="fourCards" @doms="setFourCardDoms" :change="cardChange" />
        </GameBoard>
    </main>
</template>

<style scoped>
.text {
    color: white;
}
</style>