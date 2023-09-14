import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game1',
      name: 'game1',
      // Lazy Loading
      component: () => import('../views/Game1View.vue')
    }
  ]
})

export default router
