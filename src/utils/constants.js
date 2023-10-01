const PokerSymbols = Object.freeze(['♣', '♦', '♥', '♠']);
const PokerNumbers = Object.freeze(['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']);
export const FOUR_SUITS = Object.freeze(['club', 'diamond', 'heart', 'spade']);
export const SEVEN_STACKS = Object.freeze(['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh']);

export const PokerValuesMap = Object.freeze(
    new Array(52).fill(0)
        .map((v, idx) => {
            let symbolIndex = Math.floor(idx / 13);
            return {
                content: `${PokerSymbols[symbolIndex] + PokerNumbers[idx % 13]}`,
                isRed: symbolIndex % 3 > 0,
            };
        })
);