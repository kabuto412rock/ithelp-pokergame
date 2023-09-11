<script setup>
import Card from "./Card.vue";
const CardSymbols = Object.freeze(['♣', '♦', '♥', '♠']);

</script>
<template>
    <div class="game-board">
        <div class="card-row">

            <Card :symbol="CardSymbols[0]" :num="1" />
            <Card :symbol="CardSymbols[0]" :num="2" />
            <Card :symbol="CardSymbols[0]" :num="3" />
            <Card :symbol="CardSymbols[0]" :num="4" />
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
}
</style>