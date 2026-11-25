import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import GalleryView from '../views/GalleryView.vue'
import SingleImageView from '../views/SingleImageView.vue'
import DrawingView from '../views/DrawingView.vue'

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
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
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
    },
  ],
})

export default router
