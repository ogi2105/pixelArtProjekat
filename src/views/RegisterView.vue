<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useNotify } from '@/composables/useNotify'

const router = useRouter()
const authStore = useAuthStore()
const notify = useNotify()

const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)

const errors = reactive({
  username: '',
  password: '',
  confirmPassword: '',
})

function validate(): boolean {
  errors.username = ''
  errors.password = ''
  errors.confirmPassword = ''

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

  if (confirmPassword.value !== password.value) {
    errors.confirmPassword = 'Lozinke se ne poklapaju.'
  }

  return !errors.username && !errors.password && !errors.confirmPassword
}

async function handleSubmit() {
  if (!validate() || isSubmitting.value) return

  isSubmitting.value = true
  try {
    await authStore.register({
      username: username.value.trim(),
      password: password.value,
    })
    notify.success('Registracija je uspešna! Sada se možete prijaviti.')
    await router.push('/login')
  } catch (err) {
    notify.error(err, 'Registracija nije uspela.')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2>Registracija</h2>
      <p class="subtitle">Napravite nalog i započnite crtanje.</p>

      <form @submit.prevent="handleSubmit" novalidate class="auth-form">
        <div class="form-group">
          <label for="reg-username">Korisničko ime</label>
          <input
            id="reg-username"
            v-model="username"
            type="text"
            autocomplete="username"
            placeholder="2–32 karaktera"
            :class="{ invalid: errors.username }"
          />
          <span v-if="errors.username" class="field-error">{{ errors.username }}</span>
        </div>

        <div class="form-group">
          <label for="reg-password">Lozinka</label>
          <input
            id="reg-password"
            v-model="password"
            type="password"
            autocomplete="new-password"
            placeholder="8–128 karaktera"
            :class="{ invalid: errors.password }"
          />
          <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
        </div>

        <div class="form-group">
          <label for="reg-confirm">Potvrda lozinke</label>
          <input
            id="reg-confirm"
            v-model="confirmPassword"
            type="password"
            autocomplete="new-password"
            placeholder="Ponovite lozinku"
            :class="{ invalid: errors.confirmPassword }"
          />
          <span v-if="errors.confirmPassword" class="field-error">{{ errors.confirmPassword }}</span>
        </div>

        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          {{ isSubmitting ? 'Kreiranje naloga...' : 'Registruj se' }}
        </button>
      </form>

      <p class="switch-link">
        Već imate nalog?
        <RouterLink to="/login">Prijavite se</RouterLink>
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
