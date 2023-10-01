<script setup>
import draggable from 'vuedraggable'
import { onMounted, ref, watch } from "vue";
import Card from './Card.vue';
const props = defineProps({
    fourCards: {
        type: Object,
        required: true,
        validator: (value) => {
            return (
                value.hasOwnProperty('club') &&
                value.hasOwnProperty('diamond') &&
                value.hasOwnProperty('heart') &&
                value.hasOwnProperty('spade')
            );
        },
    },
    moveCard: {
        type: Function,
        default: () => { return false; }
    },
    change: {
        type: Function,
        default: () => { return false; }
    }
})
const fourCards = ref({
    club: [],
    diamond: [],
    heart: [],
    spade: [],
});
watch(props.fourCards, (newVal) => {
    fourCards.value = newVal;
});

const club = ref(null);
const diamond = ref(null);
const heart = ref(null);
const spade = ref(null);
const emit = defineEmits(['doms'])

onMounted(() => {
    emit('doms', {
        club: club.value.targetDomElement,
        diamond: diamond.value.targetDomElement,
        heart: heart.value.targetDomElement,
        spade: spade.value.targetDomElement,
    })
})
</script>
<template>
    <div style="display: flex;">
        <div class="card club" dcid="club">
            <draggable :list="fourCards.club" group="pokers" itemKey="value" class="drag-cards" ref="club" :move="moveCard"
                @change="change">
                <template #item="{ element, index }">
                    <Card :value="element.value" :isOpen="element.isOpen" />
                </template>
            </draggable>
        </div>
        <div class="card diamond" dcid="diamond">
            <draggable :list="fourCards.diamond" group="pokers" itemKey="value" class="drag-cards" ref="diamond"
                :move="moveCard" @change="change">
                <template #item="{ element, index }">
                    <Card :value="element.value" :isOpen="element.isOpen" />
                </template>
            </draggable>
        </div>
        <div class="card heart" dcid="heart">
            <draggable :list="fourCards.heart" group="pokers" itemKey="value" class="drag-cards" ref="heart"
                :move="moveCard" @change="change">
                <template #item="{ element, index }">
                    <Card :value="element.value" :isOpen="element.isOpen" />
                </template>
            </draggable>
        </div>
        <div class="card spade" dcid="spade">
            <draggable :list="fourCards.spade" group="pokers" itemKey="value" class="drag-cards" ref="spade"
                :move="moveCard" @change="change">
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
