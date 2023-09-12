<script setup>
import { ref } from "vue";
import Card from "./Card.vue";
const boardCards = ref(
    new Array(14)
        .fill(1).map((v, index) => ({ value: index, isShow: (index % 2 == 0) }))
);

</script>
<template>
    <div class="game-board">
        <div class="card-row">
            <Card v-for="card in boardCards" key="card.value" :value="card.value" />
        </div>
    </div>
</template>

<style scoped>
div.game-board {
    min-width: 90%;
    width: auto;
    min-height: 600px;
    margin: 2px auto;
    background-color: #009933;
    border: 2px solid #000;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
}

.card-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* ignore */
}
</style>