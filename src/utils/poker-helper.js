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

/** 洗好的撲克牌
 * @returns {Card[]} 洗好的撲克牌
 */
function geneateShuffleDeck() {
    let deck = [];
    for (let i = 0; i < 52; i++) {
        deck.push({
            value: i,
            isOpen: false,
            isDone: false
        });
    }
    return shuffle(deck);
}

export {
    geneateShuffleDeck,
}