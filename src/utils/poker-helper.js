/**
 * 撲克牌
 * @typedef {Object} Card
 * @property {Number} value - 點數(0~52)
 * @property {boolean} isOpen - 是否已翻開  
 */
/**
 * 洗撲克牌
 * @param {Card[]} deck 
 * @returns 
 */
function shuffle(deck) {
    let length = deck.length;
    for (let i = 0; i < length; i++) {
        let rand_to_swap = Math.floor(Math.random()*(length-i));
        let tmp = deck[length-1-i];
        deck[length-1-i] = deck[rand_to_swap];
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
function geneateDeck(n=52, isOpen=false) {
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
function geneateShuffleDeck(n=52) {
    let deck = geneateDeck(n);
    return shuffle(deck);
}

export {
    geneateShuffleDeck,
    geneateDeck
}