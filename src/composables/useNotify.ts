import { ref } from 'vue'
import { ApiRequestError } from '@/services/api'
import type { ErrorCode } from '@/types/api'

export interface NotificationItem {
  id: number
  type: 'success' | 'error'
  message: string
}

const notifications = ref<NotificationItem[]>([])
let nextId = 1

const ERROR_MESSAGES: Record<ErrorCode, string> = {
  'DUPLICATE USERNAME': 'Korisničko ime je već zauzeto.',
  BAD_PICTURE_DATA: 'Podaci slike nisu ispravni (mora biti matrica boja do 24x24).',
  LOGGED_IN: 'Već ste prijavljeni.',
  'INCORRECT CREDENTIALS': 'Pogrešno korisničko ime ili lozinka.',
  'INVALID DATA': 'Poslati podaci nisu validni.',
  'NO SUCH ENTITY': 'Traženi resurs ne postoji.',
  'NOT YOURS': 'Nemate dozvolu za izmenu ili brisanje ovog crteža.',
  NOT_AUTHENTICATED: 'Morate biti prijavljeni da biste izvršili ovu akciju.',
  'INTERNAL ERROR': 'Došlo je do greške na serveru. Pokušajte ponovo.',
}

export function useNotify() {
  function push(type: 'success' | 'error', message: string, durationMs = 4000) {
    const id = nextId++
    notifications.value.push({ id, type, message })

    window.setTimeout(() => {
      remove(id)
    }, durationMs)
  }

  function success(message: string, durationMs = 3500) {
    push('success', message, durationMs)
  }

  function error(err: unknown, fallbackMessage?: string) {
    if (err instanceof ApiRequestError) {
      push('error', ERROR_MESSAGES[err.code] || fallbackMessage || err.code, 5000)
      return
    }
    if (err instanceof Error) {
      push('error', fallbackMessage || err.message, 4500)
      return
    }
    push('error', fallbackMessage || 'Došlo je do greške.', 4500)
  }

  function remove(id: number) {
    notifications.value = notifications.value.filter((item) => item.id !== id)
  }

  return {
    notifications,
    success,
    error,
    remove,
  }
}
