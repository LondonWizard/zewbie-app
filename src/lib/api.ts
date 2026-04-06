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

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('auth_user')
      window.location.href = '/auth/login'
    }
    return Promise.reject(error)
  },
)

export default api
