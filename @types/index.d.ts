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
    dealerStacks: Card[];
    club: Card[];
    diamond: Card[];
    heart: Card[];
    spade: Card[];
}
interface MoveHint {
    fromName: String, // 來源牌堆的名稱
    fromIndex: Number,// 撲克牌在來源牌堆中的位置 
    card: Card,       // 應拖曳的撲克牌
    toName: String,   // 目標牌堆的名稱
}
export {
    Card,
    CardStacks,
    MoveHint
}