<script setup lang="ts">
import { RouterView } from 'vue-router'
import Navbar from '@/components/TheNavbar.vue'
</script>

<template>
  <div class="app-layout">
    <!-- Zaglavlje -->
    <header class="main-header">
      <div class="logo-container">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="40" height="40" />
        <span class="brand-title">Pixel Art</span>
      </div>
      <Navbar />
    </header>

    <!-- Ovde se dinamički menjaju stranice (Home, Drawing, Gallery, Login...) -->
    <main class="view-container">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.main-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: #ffffff;
  border-bottom: 1px solid #eaeaea;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  width: 100%;
  box-sizing: border-box; /* Sprečava da padding širi element preko 100% */
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  display: block;
}

.brand-title {
  font-weight: bold;
  font-size: 1.2rem;
  color: #2c3e50;
}

.view-container {
  flex: 1;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
}
</style>
