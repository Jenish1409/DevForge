import { apiFetch, setToken, clearToken } from './client'

export async function login(username, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  setToken(data.token)
  return data
}

export function logout() {
  clearToken()
}
