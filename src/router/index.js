import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/home',
    //   name: 'home',
    //   component: HomeView
    // },
    // 紙牌接龍
    {
      path: '/',
      name: 'dragdemo',
      // Lazy Loading
      component: () => import('../views/DragDemo.vue')
    },
    // 撲克牌連連看
    {
      path: '/game1',
      name: 'game1',
      // Lazy Loading
      component: () => import('../views/Game1View.vue')
    },
    // {
    //   path: '/dealer-area',
    //   name: 'dealer-area-practice',
    //   // Lazy Loading
    //   component: () => import('../views/DealerAreaView.vue')
    // },
  ]
})

export default router
