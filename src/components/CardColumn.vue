<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import Card from '../components/Card.vue';
const { cards, onClick } = defineProps(['cards', 'onClick']);

const emit = defineEmits(['position']);
const isEmpty = computed(() => {
    return cards.length == 0;
})

const cardBox = ref(null);
onMounted(() => {
    const rect = cardBox.value.getBoundingClientRect();
    const x = window.scrollX + rect.left;
    const y = window.scrollY + rect.top;
    emit('position', { x, y });
})
</script>
<template >
    <div class="card-box" :class="{ 'empty-card-box': isEmpty }">
        <div class="card" style="visibility: hidden;"></div>
        <div style="visibility: visible; position: absolute; z-index: 5;" ref="cardBox">
            <TransitionGroup name="fade" tag="div" style="; display: grid; grid-template-rows: repeat(13, 2rem);">
                <Card v-for="(card, index) in cards" @click="(event) => onClick(event.target)" :key="card.value"
                    :value="card.value" :isOpen="card.isOpen" />
            </TransitionGroup>
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

/* 定義動畫的過渡效果 */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
    transform: translateX(3rem);
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>