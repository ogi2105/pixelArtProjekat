<script setup lang="ts">
import { useNotify } from '@/composables/useNotify'

const { notifications, remove } = useNotify()
</script>

<template>
  <div class="toast-container" aria-live="polite">
    <div
      v-for="item in notifications"
      :key="item.id"
      class="toast-item"
      :class="item.type"
      @click="remove(item.id)"
    >
      <span class="toast-icon">{{ item.type === 'success' ? '✓' : '!' }}</span>
      <span class="toast-text">{{ item.message }}</span>
    </div>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 10000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 360px;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  color: #ffffff;
  font-size: 0.92rem;
  font-weight: 500;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.16);
  cursor: pointer;
}

.toast-item.success {
  background-color: #2f9e44;
}

.toast-item.error {
  background-color: #e03131;
}

.toast-icon {
  font-weight: 700;
  font-size: 1rem;
}
</style>
