<script setup>
import draggable from 'vuedraggable'
import { computed, ref } from 'vue';
import Card from '../components/Card.vue';
const { deck } = defineProps(
    {
        deck: {
            type: Array,
            default: () => []
        }
    }
)
const index = ref(0);

function clickCard() {
    index.value++;
    if (index.value > deck.length) {
        index.value = 0;
    }
}
/** 玩家可拿取的牌 */
const canTakeCards = computed(() => {
    let startIndex = index.value < 3 ? 0 : index.value - 3;
    return deck.slice(startIndex, index.value);
});
const deckState = computed(() => {
    if (index.value === 0 && deck.length == 0) return 'empty';
    if (index.value === deck.length) return 'full';
    return 'normal';
});
</script>
<template>
    <div style="display: grid; grid-template-columns: 1.5fr 1fr; gap:3rem; width: fit-content; overflow-x: hidden;">
        <!-- 移牌區 - 左邊水平疊牌最多三張 -->
        <draggable :list="canTakeCards" group="pokers" itemKey="value" class="list-group" :move="(evt) => console.log(evt)">
            <template #item="{ element, index }">
                <Card :value="element.value" :isOpen="element.isOpen" />
            </template>
        </draggable>
        <!-- 發牌堆 -->
        <div class="card-box">
            <div class="card " style="visibility: hidden;">
                <div style="visibility: visible; width: 100%;height: 100%;" @click="clickCard">
                    <Transition name="slide-left">
                        <div v-if="deckState == 'empty'">無牌可用</div>
                        <div v-else-if="deckState == 'full'" class="card">重新循環</div>
                        <div v-else-if="deckState == 'normal'" class="card-back animation"></div>
                    </Transition>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.text {
    color: white;
}

.slide-left-enter-active,
.slide-left-leave-active {
    transition: all 0.25s ease-out;
}

.slide-left-enter-from {
    opacity: 0;
    transform: translateX(60px);
}

.slide-left-leave-to {
    opacity: 0;
    transform: translateX(-60px);
}

.card-box {
    border: 3px solid yellow;
    padding: 3px;
    margin: 1px;
    background-size: cover;
    /* display: flex; */
    /* flex-direction: column; */
    position: relative;
}

.card-back {
    /** 避免背圖因為padding超出框框 */
    width: 100%;
    height: 100%;
    /* 背圖 */
    background: url("@/assets/imgs/foxy01.jpg") no-repeat center;
    /* 使用 cover 屬性讓背景圖包裹在容器內 */
    background-size: cover;
    border-radius: 10%;
}

.list-group {
    display: grid;
    grid-template-columns: repeat(3, 3rem);
}

/** */
@keyframes move-left {
    from {
        transform: translateX(0rem);
    }

    to {
        transform: translateX(-100rem);
    }
}

.card-back.animation:active {
    animation: move-left 0.55s ease;
    animation-iteration-count: 1;
}

@keyframes swing {
    0% {
        transform: rotate(-5deg);
    }

    50% {
        transform: rotate(5deg);
    }

    100% {
        transform: rotate(-5deg);
    }
}

.card-back:hover {
    cursor: pointer;
    animation: swing 1s ease infinite;
}
</style>