<script setup>
import { RouterView, RouterLink } from 'vue-router';
</script>
<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/game1">撲克牌連連看</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>


