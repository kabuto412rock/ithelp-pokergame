<template scoped>
    <div class="card-row">
        <slot>沒有卡片喔...</slot>
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