<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotify } from '@/composables/useNotify'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const notify = useNotify()

const username = ref('')
const password = ref('')
const isSubmitting = ref(false)

const errors = reactive({
  username: '',
  password: '',
})

function validate(): boolean {
  errors.username = ''
  errors.password = ''

  const trimmedUser = username.value.trim()
  if (!trimmedUser) {
    errors.username = 'Korisničko ime je obavezno.'
  } else if (trimmedUser.length < 2 || trimmedUser.length > 32) {
    errors.username = 'Korisničko ime mora imati između 2 i 32 karaktera.'
  }

  if (!password.value) {
    errors.password = 'Lozinka je obavezna.'
  } else if (password.value.length < 8 || password.value.length > 128) {
    errors.password = 'Lozinka mora imati između 8 i 128 karaktera.'
  }

  return !errors.username && !errors.password
}

async function handleSubmit() {
  if (!validate() || isSubmitting.value) return

  isSubmitting.value = true
  try {
    await authStore.login({
      username: username.value.trim(),
      password: password.value,
    })
    notify.success('Uspešno ste se prijavili!')
    const redirectPath = typeof route.query.redirect === 'string' ? route.query.redirect : '/gallery'
    await router.push(redirectPath)
  } catch (err) {
    notify.error(err, 'Neuspešna prijava.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2>Prijava</h2>
      <p class="subtitle">Prijavite se da biste crtali i čuvali svoje pixel art radove.</p>

      <form @submit.prevent="handleSubmit" novalidate class="auth-form">
        <div class="form-group">
          <label for="login-username">Korisničko ime</label>
          <input
            id="login-username"
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="Unesite korisničko ime"
            :class="{ invalid: errors.username }"
          />
          <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="login-password">Lozinka</label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Unesite lozinku"
            :class="{ invalid: errors.password }"
          />
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Prijavljivanje...' : 'Prijavi se' }}
        </button>
      </form>

      <p class="switch-link">
        Nemate nalog?
        <RouterLink to="/register">Registrujte se</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 140px);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  padding: 2rem;
  border-radius: 14px;
  border: 1px solid #e9ecef;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.auth-card h2 {
  margin: 0 0 0.4rem;
  color: #2c3e50;
}

.subtitle {
  margin: 0 0 1.5rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #343a40;
}

.form-group input {
  padding: 0.65rem 0.85rem;
  border: 1px solid #ced4da;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #42b883;
}

.form-group input.invalid {
  border-color: #e03131;
}

.field-error {
  font-size: 0.82rem;
  color: #e03131;
}

.submit-btn {
  margin-top: 0.4rem;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  background-color: #42b883;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background-color: #369f6f;
}

.submit-btn:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.switch-link {
  margin: 1.25rem 0 0;
  text-align: center;
  font-size: 0.9rem;
  color: #495057;
}

.switch-link a {
  color: #42b883;
  font-weight: 600;
  text-decoration: none;
}
</style>
