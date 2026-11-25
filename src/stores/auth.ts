import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { apiRequest, setAuthTokenProvider } from '@/services/api'
import type { LoginReq, LoginRes, UserCreationReq, UserCreationRes } from '@/types/api'

const STORAGE_KEYS = {
  token: 'pixeldraw_token',
  userId: 'pixeldraw_user_id',
  username: 'pixeldraw_username',
} as const

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem(STORAGE_KEYS.token))
  const userId = ref<string | null>(localStorage.getItem(STORAGE_KEYS.userId))
  const username = ref<string | null>(localStorage.getItem(STORAGE_KEYS.username))

  const isAuthenticated = computed(() => Boolean(token.value))

  setAuthTokenProvider(() => token.value)

  function persistSession(newToken: string, newUserId: string, newUsername: string) {
    token.value = newToken
    userId.value = newUserId
    username.value = newUsername

    localStorage.setItem(STORAGE_KEYS.token, newToken)
    localStorage.setItem(STORAGE_KEYS.userId, newUserId)
    localStorage.setItem(STORAGE_KEYS.username, newUsername)
  }

  function clearSession() {
    token.value = null
    userId.value = null
    username.value = null

    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.userId)
    localStorage.removeItem(STORAGE_KEYS.username)
  }

  async function login(payload: LoginReq): Promise<LoginRes> {
    const res = await apiRequest<LoginRes>('/auth/login', {
      method: 'POST',
      body: payload,
    })
    persistSession(res.token, res.user_id, res.username)
    return res
  }

  async function register(payload: UserCreationReq): Promise<UserCreationRes> {
    return await apiRequest<UserCreationRes>('/auth/register', {
      method: 'POST',
      body: payload,
    })
  }

  function logout() {
    clearSession()
  }

  return {
    token,
    userId,
    username,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
