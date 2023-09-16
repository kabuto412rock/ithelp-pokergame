<script setup>
import { computed } from 'vue';
import Card from '../components/Card.vue';
const { cards, onClick } = defineProps(['cards', 'onClick']);
const isEmpty = computed(() => {
    return cards.length == 0;
}) 
</script>
<template >
    <div class="card-box" :class="{ 'empty-card-box': isEmpty }">
        <div class="card" style="visibility: hidden;"></div>
        <div style="visibility: visible; ; z-index: 5;">
            <div v-if="isEmpty">沒牌</div>
            <div v-else style="; display: grid; grid-template-rows: repeat(5, 3rem);">
                <Card v-for="(card, index) in cards" @click="onClick" :key="card.value" :value="card.value"
                    :isOpen="card.isOpen" />
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
</style>