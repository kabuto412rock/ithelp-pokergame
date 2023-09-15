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
        <div v-if="isEmpty">沒牌啦</div>
        <div v-else class="card">
            <Card v-for="(card, index) in cards" :key="card.value" :value="card.value" :isOpen="card.isOpen" />
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
</style>