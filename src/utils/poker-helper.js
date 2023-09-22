/**
 * @typedef {import('../../@types/index').Card} Card
 */
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

export {
    geneateShuffleDeck,
    geneateDeck,
    getPosition,
    checkNextOk
}