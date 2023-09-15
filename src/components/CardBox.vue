<script setup>
</script>
<template >
    <div class="card-box">
        <slot>
            <div class="card" style="visibility: hidden;"></div>
        </slot>
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
    -ms-flex-align: center;
}
</style>