 interface Card {
    value: number; // - 點數(0~52)
    isOpen: boolean; // - 是否已翻開 
    isDone: boolean; // - 是否此卡牌已完成
}
interface CardStacks {
    first: Card[];
    second: Card[];
    third: Card[];
    fourth: Card[];
    fifth: Card[];
    sixth: Card[];
    seventh: Card[];
    none: Card[];
    delaerStacks: Card[];
    club: Card[];
    diamond: Card[];
    heart: Card[];
    spade: Card[];
  }
export {
    Card,
    CardStacks
}