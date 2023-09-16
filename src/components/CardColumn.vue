<script setup>
import { computed } from 'vue';
import Card from '../components/Card.vue';
const { cards } = defineProps(['cards']);
const isEmpty = computed(() => {
    return cards.length == 0;
}) 
</script>
<template >
    <div class="card card-box" :class="{ 'empty-card-box': isEmpty }">
        <div class="card" style="visibility: hidden;">
            <div style="visibility: visible;">
                <div v-if="isEmpty">沒牌</div>
                <div v-else class="grid-container">
                    <Card v-for="(card, index) in cards" :key="card.value" :value="card.value" :isOpen="card.isOpen" />
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.card-box {
    border: 4px solid yellow;
    width: fit-content;
    padding: 3px;
    margin: 1px;
    display: flex;
    flex-direction: column;
    position: relative;
}

.empty-card-box {
    background-color: #2c3e50;
    color: white;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(5, 100px);
    /* 默认情况下，创建5列，每列宽度为100px */
    grid-gap: 10px;
    /* 列之间的间隙*/
}

.grid-item {
    height: 100px;
    background-color: #3498db;
    color: #fff;
    text-align: center;
    line-height: 100px;
}

.grid-item:nth-child(1) {
    /* margin-left: -50px * ($i - 1); */
}
</style>