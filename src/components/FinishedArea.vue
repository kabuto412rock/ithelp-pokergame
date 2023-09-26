<script setup>
import draggable from 'vuedraggable'
import { onMounted, reactive } from "vue";
import { geneateDeck } from '../utils/poker-helper';
import Card from './Card.vue';
const fourCards = reactive({
    club: [],
    diamond: [],
    heart: [],
    spade: [],
});
onMounted(() => {
    const cards = geneateDeck(52, true);
    fourCards.club = cards.slice(0, 1);
    fourCards.diamond = cards.slice(13, 14);
    fourCards.heart = cards.slice(26, 27);
    fourCards.spade = cards.slice(39, 40);
})
</script>
<template>
    <div style="display: flex;">
        <div class="card club">
            <draggable :list="fourCards.club" group="pokers" itemKey="value" class="drag-cards">
                <template #item="{ element, index }">
                    <Card :value="element.value" :isOpen="element.isOpen" />
                </template>
            </draggable>
        </div>
        <div class="card diamond">
            <draggable :list="fourCards.diamond" group="pokers" itemKey="value" class="drag-cards">
                <template #item="{ element, index }">
                    <Card :value="element.value" :isOpen="element.isOpen" />
                </template>
            </draggable>
        </div>
        <div class="card heart">
            <draggable :list="fourCards.heart" group="pokers" itemKey="value" class="drag-cards">
                <template #item="{ element, index }">
                    <Card :value="element.value" :isOpen="element.isOpen" />
                </template>
            </draggable>
        </div>
        <div class="card spade">
            <draggable :list="fourCards.spade" group="pokers" itemKey="value" class="drag-cards">
                <template #item="{ element, index }">
                    <Card :value="element.value" :isOpen="element.isOpen" />
                </template>
            </draggable>
        </div>
    </div>
</template>
<style scoped>
.diamond {
    background: url("@/assets/imgs/diamond-card.png") no-repeat center;
    background-size: cover;
}

.club {
    background: url("@/assets/imgs/club-card.png") no-repeat center;
    background-size: cover;
}

.heart {
    background: url("@/assets/imgs/heart-card.png") no-repeat center;
    background-size: cover;
}

.spade {
    background: url("@/assets/imgs/spade-card.png") no-repeat center;
    background-size: cover;
}

.drag-cards {
    width: 100%;
    height: 100%;
}
</style>
