import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import GalleryView from '../views/GalleryView.vue'
import SingleImageView from '../views/SingleImageView.vue'
import DrawingView from '../views/DrawingView.vue'
import { useAuthStore } from '@/stores/auth'
import { useNotify } from '@/composables/useNotify'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { guestOnly: true },
    },
    {
      path: '/gallery',
      name: 'gallery',
      component: GalleryView,
    },
    {
      path: '/image/:id',
      name: 'single-image',
      component: SingleImageView,
    },
    {
      path: '/drawing',
      name: 'drawing',
      component: DrawingView,
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  const notify = useNotify()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    notify.error(new Error('Morate biti prijavljeni da biste pristupili ovoj stranici.'))
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'gallery' }
  }
})

export default router
