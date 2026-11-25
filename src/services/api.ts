import type { APIErrorCommon, ErrorCode } from '@/types/api'

const BASE_URL = 'https://pixeldraw.cituljko.pp.ua/api'

export class ApiRequestError extends Error {
  public readonly code: ErrorCode
  public readonly extra?: unknown
  public readonly status: number

  constructor(errorBody: APIErrorCommon, status: number) {
    super(errorBody.code)
    this.name = 'ApiRequestError'
    this.code = errorBody.code
    this.extra = errorBody.extra
    this.status = status
  }
}

let authTokenProvider: (() => string | null) | null = null

export function setAuthTokenProvider(provider: () => string | null) {
  authTokenProvider = provider
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  body?: unknown
  query?: Record<string, string | number | boolean | undefined>
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, query } = options

  const url = new URL(`${BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`)
  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }

  const headers: Record<string, string> = {}
  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  const token = authTokenProvider?.()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(url.toString(), {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiRequestError({ failed: true, code: 'INTERNAL ERROR' }, 0)
  }

  let data: unknown = null
  const contentType = response.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    data = await response.json()
  }

  if (
    !response.ok ||
    (data &&
      typeof data === 'object' &&
      'failed' in data &&
      (data as { failed?: boolean }).failed === true)
  ) {
    const errObj =
      data && typeof data === 'object' && 'code' in data
        ? (data as APIErrorCommon)
        : ({ failed: true, code: 'INTERNAL ERROR' } as APIErrorCommon)
    throw new ApiRequestError(errObj, response.status)
  }

  return data as T
}
