/**
 * @typedef {import('../../@types/index').Card} Card
 * @typedef {import('../../@types/index').CardStacks} CardStacks
 * @typedef {import('../../@types/index').MoveHint } MoveHint
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
 * @returns {Map<Number, String>} Map<撲克牌編號, 目標牌堆名稱>
 */
function findTailCards(cardstacks) {
    const result = new Map();

    // 找出可拖曳至7牌堆尾巴的牌
    SEVEN_STACKS.forEach((name) => {
        const stack = cardstacks[name];
        if (stack.length === 0) {
            [12, 25, 38, 51].forEach((value) => {
                result.set(value, name);
            });
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
        [matchNumber + (isBlack ? 13 : 0), matchNumber + (isBlack ? 26 : 39)].forEach((value) => {
            result.set(value, name);
        });
    });
    // 找出可拖曳至結算牌堆尾巴的牌
    FOUR_SUITS.forEach((name, index) => {
        const stack = cardstacks[name];
        if (stack.length === 0) {
            result.set(0 + index * 13, name);
            return;
        }

        const lastCard = stack[stack.length - 1];
        const lastCardNumber = lastCard.value % 13;
        // 檢查是否為K，則跳過
        if (lastCardNumber === 12) {
            return;
        }
        const matchNumber = lastCardNumber + 1;
        result.set(matchNumber + index * 13, name);
    });
    return result;
}


/** 取得一個移動提示
 * @param {CardStacks} cardStacks 
 * @param {number} dealerIndex 
 * @returns {MoveHint | null} 移動提示
 */
function getMoveHint(cardStacks, dealerIndex) {
    const tailValuesMap = findTailCards(cardStacks);
    let hintAnswer = null;
    // 發牌區
    let startIndex = dealerIndex < 3 ? 0 : dealerIndex - 3;
    const dealerCards = cardStacks['dealerStacks'].slice(startIndex, dealerIndex);
    dealerCards.forEach((card) => {
        if (tailValuesMap.has(card.value)) {
            hintAnswer = {
                fromName: 'dealerStacks',
                card: card,
                fromIndex: cardStacks['dealerStacks'].findIndex((c) => c.value === card.value),
                toName: tailValuesMap.get(card.value),
            };
        }
    });
    if (hintAnswer != null) return hintAnswer;
    // 7個牌堆
    SEVEN_STACKS.forEach((name) => {
        let len = cardStacks[name].length;
        for (let i = 0; i < len; i++) {
            let card = cardStacks[name][i];
            // 由上往下找，遇到未開牌就跳過
            if (!card.isOpen) continue;
            if (tailValuesMap.has(card.value)) {
                const toName = tailValuesMap.get(card.value);
                // 只能拿最後一張牌放 結算牌堆
                if (FOUR_SUITS.includes(toName) && i !== len - 1) continue;
                hintAnswer = {
                    fromName: name,
                    card: card,
                    fromIndex: i,
                    toName: toName,
                };
                break;
            }
        }
    });
    if (hintAnswer != null) return hintAnswer;

    // 結算牌堆
    FOUR_SUITS.forEach((name) => {
        let len = cardStacks[name].length;
        if (len == 0) return;
        let card = cardStacks[name][len - 1];
        if (tailValuesMap.has(card.value)) {
            hintAnswer = {
                fromName: name,
                card: card,
                fromIndex: len - 1,
                toName: tailValuesMap.get(card.value),
            };
        }
    });

    return hintAnswer;
}

/**
 * 找出`指定牌`可以接在哪一個牌堆(7牌堆or結算牌堆)的後面
 * @param {CardStacks} cardstacks 牌堆
 * @param {Card} targetCard 指定牌
 * @returns {Array<String>} Array<目標牌堆名稱>
 */
function findFollowDeckName(cardstacks, targetCard) {
    const result = new Set();

    // 找出可拖曳至7牌堆尾巴的牌
    SEVEN_STACKS.forEach((name) => {
        const stack = cardstacks[name];
        if (stack.length === 0) {
            if ([12, 25, 38, 51].includes(targetCard.value)) {
                result.add(name);
            }
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
        const isInclude = [matchNumber + (isBlack ? 13 : 0), matchNumber + (isBlack ? 26 : 39)].includes(targetCard.value);
        if (isInclude) result.add(name);
    });


    // 找出可拖曳至結算牌堆尾巴的牌
    FOUR_SUITS.forEach((name, index) => {
        const stack = cardstacks[name];
        if (stack.length === 0) {
            if (index * 13 == targetCard.value) result.add(name);
            return;
        }
        const lastCard = stack[stack.length - 1];
        const lastCardNumber = lastCard.value % 13;
        // 檢查是否為K，則跳過
        if (lastCardNumber === 12) {
            return;
        }
        const matchNumber = lastCardNumber + 1;
        if (matchNumber + index * 13 == targetCard.value) {
            result.add(name);
        }
    });
    return Array.from(result);
}

/** 
 * 檢查紙牌接龍是否完成
 * @param {CardStacks} cardStacks 
 */
function checkSolitaireGameDone(cardStacks) {
    // 檢查每組牌堆第一張牌覆蓋著，就代表遊戲還沒結束
    const isDone = SEVEN_STACKS.reduce((prev, stackName) => {
        const stack = cardStacks[stackName];
        if (stack.length > 0 && (!stack[0].isOpen)) {
            return false;
        }
        return prev;
    }, true);
    return isDone;
}
/** 
 * 計算剩餘在發牌區和7牌堆的張數
 * @param {CardStacks} cardStacks 
 * @returns {Object} {dealer: number, seven: number}
 */
function getRemainCardCount(cardStacks) {
    let dealerStacksCount = cardStacks['dealerStacks'].length;

    let sevenCount = 0;
    SEVEN_STACKS.forEach((name) => {
        sevenCount += cardStacks[name].length;
    });
    return {
        dealer: dealerStacksCount,
        seven: sevenCount,
    };
}

/** 檢查是否已死局 
 * @param {CardStacks} cardStacks
 * @returns {boolean} 死局為true 活局為false
*/
function checkDeadGame(cardStacks) {
    // 7牌堆中被隱藏的牌們
    let hideCardNumbers = [];
    // 7牌堆中第一張被翻開的牌們
    let firstOpenCardNumbers = [];
    // 7牌堆中最後一張牌
    let lastCardNumbers = [];
    SEVEN_STACKS.forEach((name) => {
        let stack = cardStacks[name];
        if (stack.length !== 0) {
            lastCardNumbers.push(stack[stack.length - 1].value);
        };
        for (let i = 0; i < stack.length; i++) {
            let card = stack[i];
            if (card.isOpen) {
                firstOpenCardNumbers.push(card.value);
                break;
            } else {
                hideCardNumbers.push(card.value);
            }
        }
    });
    const isDeadGame = firstOpenCardNumbers.some((number) => {
        const isBlack = (number / 13 % 3) === 0
        let number1 = (number + 1) % 13 + (isBlack ? 13 : 0);
        let number2 = (number + 1) % 13 + number + (isBlack ? 26 : 39);
        return hideCardNumbers.includes(number1)
            && hideCardNumbers.includes(number2)
            // 排除例外情況: 
            && !(lastCardNumbers.includes(number1) || lastCardNumbers.includes(number2));
    });

    return isDeadGame;
}

/** 取得相同數字不同顏色的撲克牌編碼
 * @param {Number} pokerValue 對應撲克牌的編號
 * @returns {Array} [number1, number2] 
 */
function getDifferentColorPokerValues(pokerValue) {
    const red = (Math.floor(pokerValue / 13) % 3) == 0
    const number = pokerValue % 13;
    return [number + (red ? 13 : 0), number + (red ? 26 : 39)];
}
/** 檢查是否還有效的移動卡牌
 * @param {CardStacks} cardStacks
 * @returns {boolean} 有有效移動為true 可能沒有為false
 */
function checkValidMove(cardStacks) {
    const dealerStacksValues = cardStacks['dealerStacks'].map((card) => card.value);

    const seventLastValues = {};

    // 1. `七牌堆`最後一張後面要接的牌存在於`發牌區`中
    let haveMove1 = SEVEN_STACKS.some((name) => {
        const stack = cardStacks[name];
        if (stack.length === 0) {
            return false;
        }
        const lastCard = stack[stack.length - 1];
        const lastCardNumber = lastCard.value % 13;
        seventLastValues[name] = lastCard.value;
        // A後面沒有要接的，但可移動到結算牌堆(回應成功)
        if (lastCardNumber === 0) return true;
        const targetPokerValues = getDifferentColorPokerValues(lastCard.value - 1);

        return dealerStacksValues.some((value) => {
            return targetPokerValues.includes(value);
        });
    });
    if (haveMove1) {
        console.log("第1活局: `七牌堆`最後一張後面要接的牌存在於`發牌區`");
        return true;
    }
    // 2. 任一`七牌堆`壓在隱藏牌上放的那張可以接在其他`七牌堆`的後面(不包含本身牌堆)
    let haveMove2 = SEVEN_STACKS.some((name) => {
        const stack = cardStacks[name];
        if (stack.length === 0) {
            return false;
        }
        let firstOpenCard = null;
        for (let i = 1; i < stack.length; i++) {
            if (stack[i].isOpen && (!stack[i - 1].isOpen)) {
                firstOpenCard = stack[i];
                break;
            }
        }
        // 沒有壓在隱藏牌上的牌或 放的那張是K無法接在其他牌堆後面(回應失敗)
        if (firstOpenCard === null || firstOpenCard.value % 13 === 12) {
            return false;
        }
        // 檢查是否有可以接的牌
        const targetPokerValues = getDifferentColorPokerValues(firstOpenCard.value + 1)
        return SEVEN_STACKS.some((name2) => {
            if (name === name2) return false;
            if (seventLastValues[name2]) {
                return targetPokerValues.includes(seventLastValues[name2]);
            }
            return false;
        });
    });

    if (haveMove2) {
        console.log("第2活局: 任一`七牌堆`壓在隱藏牌上放的那張可以接在其他`七牌堆`的後面(不包含本身牌堆)");
        return true;
    }
    // 3. `發牌區`任一張牌或`七牌堆`的最後一張 可移動至 `結算牌堆`
    let haveMove3 = FOUR_SUITS.some((suit, index) => {
        const stackLen = cardStacks[suit].length;
        if (stackLen === 13) return false;

        let targetValue = index * 13 + stackLen;
        return dealerStacksValues.includes(targetValue) || Object.values(seventLastValues).includes(targetValue);
    });
    if (haveMove3) {
        console.log("第3活局: `發牌區`任一張牌或`七牌堆`的最後一張 可移動至 `結算牌堆`");
    }
    return haveMove3;
}
export {
    geneateShuffleDeck,
    geneateDeck,
    getPosition,
    checkNextOk,
    checkNextOk2,
    getMoveHint,
    findFollowDeckName,
    checkSolitaireGameDone,
    getRemainCardCount,
    checkDeadGame,
    checkValidMove
}