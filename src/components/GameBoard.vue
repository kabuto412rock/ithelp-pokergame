<script setup>
import CardRow from './CardRow.vue';
</script>
<template>
    <div class="game-board">
        <slot>牌桌沒東西</slot>
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
</style>