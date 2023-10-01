/**
 * @typedef {import('../../@types/index').Card} Card
 * @typedef {import('../../@types/index').CardStacks} CardStacks
 */
import { FOUR_SUITS, SEVEN_STACKS } from "./constants";
/**
 * 洗撲克牌
 * @param {Card[]} deck 
 * @returns 
 */
function shuffle(deck) {
    let length = deck.length;
    for (let i = 0; i < length; i++) {
        let rand_to_swap = Math.floor(Math.random() * (length - i));
        let tmp = deck[length - 1 - i];
        deck[length - 1 - i] = deck[rand_to_swap];
        deck[rand_to_swap] = tmp;
    }
    return deck;
}
/** 產生撲克牌，預設52張
 * @returns {Card[]} 撲克牌
 * @param {Number} n - 撲克牌數量
 * @default 52
 * @example
 * geneateDeck(52) // 產生52張撲克牌
 **/
function geneateDeck(n = 52, isOpen = false) {
    let deck = [];
    for (let i = 0; i < n; i++) {
        deck.push({
            value: i,
            isOpen: isOpen,
            isDone: false
        });
    }
    return deck;
}
/** 洗好的撲克牌
 * @returns {Card[]} 洗好的撲克牌
 */
function geneateShuffleDeck(n = 52) {
    let deck = geneateDeck(n);
    return shuffle(deck);
}

function getPosition(element) {
    const rect = element.getBoundingClientRect();
    const x = window.scrollX + rect.left;
    const y = window.scrollY + rect.top;
    return { x, y }
}

/** 檢查下一張牌是否可以放上去
 * @param {Card[]} targetDeck 
 * @param {Card} card 
 * 
 * @returns {Boolean} 是否可以放上去
 */
function checkNextOk(targetDeck, card) {
    // 如果目標為空牌堆，則只有K可以放上去
    if (targetDeck.length === 0) {
        return (card.value % 13) === 12;
    }
    // 如果目標非空牌堆，則檢查最後一張
    const lastCard = targetDeck[targetDeck.length - 1];
    // 取得兩張牌花色必須一紅一黑
    const lastCardSymbol = Math.floor(lastCard.value / 13);
    const cardSymbol = Math.floor(card.value / 13);
    // 兩張牌顏色相同則移動無效
    if (lastCardSymbol == cardSymbol || (lastCardSymbol + cardSymbol) == 3) {
        return false;
    }
    // 檢查數字是否連續
    return (lastCard.value % 13 - 1) == (card.value % 13)
}
/** 檢查下一張牌是否可以放上去`集牌堆`
 * @param {String} pokerColor 牌堆花色
 * @param {Object} fourCards 四種結算牌堆
 * @param {Card} card 要放上去的牌
 * 
 * @returns {Boolean} 是否可以放上去
 */
function checkNextOk2(pokerColor, fourCards, card) {
    const pokerColorIndex = Math.floor(card.value / 13);
    const pokerNumber = card.value % 13;
    const pokerColorName = FOUR_SUITS[pokerColorIndex];

    if (pokerColorName !== pokerColor) {
        return false;
    }
    const deckCards = fourCards[pokerColor];
    if (deckCards.length === 0) {
        return pokerNumber === 0;
    }

    const lastCardNumber = deckCards[deckCards.length - 1].value % 13;
    return lastCardNumber + 1 === pokerNumber;
}

/**
 * 找出7牌堆、結算牌堆各牌尾後要接的牌
 * @param {CardStacks} cardstacks
 * @returns {Map<String, Array<Number>>} Map<目標牌堆名稱, 牌尾陣列>
 */
function findTailCards(cardstacks) {
    const result = new Map();

    // 找出可拖曳至7牌堆尾巴的牌
    SEVEN_STACKS.forEach((name) => {
        const stack = cardstacks[name];
        if (stack.length === 0) {
            result.set(name, [12, 25, 38, 51]);
            return;
        }

        const lastCard = stack[stack.length - 1];
        const lastCardNumber = lastCard.value % 13;
        const lastCardSymbol = Math.floor(lastCard.value / 13);

        // 檢查是否為A，則跳過
        if (lastCardNumber === 0) {
            return;
        }
        const matchNumber = lastCardNumber - 1;
        const isBlack = lastCardSymbol % 3 == 0;
        result.set(name, [matchNumber + (isBlack ? 13 : 0), matchNumber + (isBlack ? 26 : 39)]);
    });
    // 找出可拖曳至結算牌堆尾巴的牌
    FOUR_SUITS.forEach((name, index) => {
        const stack = cardstacks[name];
        if (stack.length === 0) {
            result.set(name, [0 + index * 13]);
            return;
        }

        const lastCard = stack[stack.length - 1];
        const lastCardNumber = lastCard.value % 13;
        // 檢查是否為K，則跳過
        if (lastCardNumber === 12) {
            return;
        }
        const matchNumber = lastCardNumber + 1;
        result.set(name, [matchNumber + index * 13]);
    });
    return result;
}
export {
    geneateShuffleDeck,
    geneateDeck,
    getPosition,
    checkNextOk,
    checkNextOk2,
    findTailCards
}