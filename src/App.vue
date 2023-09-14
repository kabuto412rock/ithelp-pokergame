<script setup>
import { RouterView, RouterLink } from 'vue-router';
</script>
<template>
  <header>
    <nav class="navbar">
      <RouterLink to="/" class="nav-link">Home</RouterLink>
      <RouterLink to="/game1" class="nav-link">撲克牌連連看</RouterLink>
    </nav>
  </header>
  <RouterView />
</template>
<style scoped>
.navbar {
  background-color: #333;
  /* 背景顏色 */
  padding: 10px 0;
  /* 上下內邊距 */
  text-align: center;
  /* 文字居中 */
}

.nav-link {
  color: #fff;
  /* 文字顏色 */
  text-decoration: none;
  /* 移除下劃線 */
  margin: 0 10px;
  /* 左右外邊距 */
  font-size: 18px;
  /* 字體大小 */
  transition: color 0.3s;
  /* 讓顏色轉換平滑 */
}

/* 滑鼠浮過時的效果 */
.nav-link:hover {
  color: #ff4500;
  /* 滑鼠浮過時的顏色 */
}
</style>


