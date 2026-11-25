<script setup lang="ts">
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotify } from '@/composables/useNotify'

const router = useRouter()
const authStore = useAuthStore()
const notify = useNotify()

async function handleLogout() {
  authStore.logout()
  notify.success('Uspešno ste se odjavili.')
  await router.push('/login')
}
</script>

<template>
  <nav class="navbar">
    <RouterLink to="/">Početna</RouterLink>
    <RouterLink to="/gallery">Galerija</RouterLink>
    <RouterLink to="/drawing">Nov crtež</RouterLink>

    <template v-if="!authStore.isAuthenticated">
      <RouterLink to="/login">Prijava</RouterLink>
      <RouterLink to="/register">Registracija</RouterLink>
    </template>

    <template v-else>
      <span class="user-badge">@{{ authStore.username }}</span>
      <button type="button" class="logout-btn" @click="handleLogout">Odjava</button>
    </template>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  gap: 15px;
  align-items: center;
}

.navbar a {
  text-decoration: none;
  color: #495057;
  font-weight: 500;
  font-size: 0.95rem;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s ease-in-out;
}

.navbar a:hover {
  color: #42b883;
  background-color: #f1f3f5;
}

.navbar a.router-link-exact-active {
  color: #ffffff;
  background-color: #42b883;
  font-weight: bold;
}

.user-badge {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2c3e50;
  padding: 6px 12px;
  background-color: #f1f3f5;
  border-radius: 6px;
}

.logout-btn {
  border: 1px solid #e03131;
  background-color: transparent;
  color: #e03131;
  font-weight: 600;
  font-size: 0.9rem;
  padding: 7px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.logout-btn:hover {
  background-color: #e03131;
  color: #ffffff;
}
</style>
