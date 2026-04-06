import axios from 'axios'

/**
 * Axios instance for the Zewbie API.
 * Ensures the base URL always ends with /v1 to match the API's global prefix.
 */
function resolveBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/v1'
  return raw.endsWith('/v1') ? raw : `${raw.replace(/\/+$/, '')}/v1`
}

const api = axios.create({
  baseURL: resolveBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Holds a reference to the Clerk getToken function.
 * Set by the App component once Clerk is loaded.
 */
let clerkGetToken: (() => Promise<string | null>) | null = null

export function setClerkTokenGetter(getter: () => Promise<string | null>) {
  clerkGetToken = getter
}

api.interceptors.request.use(async (config) => {
  if (clerkGetToken) {
    try {
      const token = await clerkGetToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {
      // Clerk not ready or user signed out
    }
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  },
)

export default api
