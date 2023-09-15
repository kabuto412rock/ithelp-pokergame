<template scoped>
    <div class="card-row">
        <slot>
            <div class="card" style="visibility: hidden;"></div>
        </slot>
    </div>
</template>

<style scoped>
.card-row {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    /* ignore */
}
</style>