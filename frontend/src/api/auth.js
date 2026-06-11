import { apiFetch, setToken, clearToken } from './client'

export async function login(username, password) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  setToken(data.token)
  return data
}

export async function registerInit(username, email, password) {
  return apiFetch('/auth/register/init', {
    method: 'POST',
    body: JSON.stringify({ username, email, password }),
  })
}

export async function registerVerify(email, otp, username, password) {
  const data = await apiFetch('/auth/register/verify', {
    method: 'POST',
    body: JSON.stringify({ email, otp, username, password }),
  })
  setToken(data.token)
  return data
}

export async function submitContact(name, email, message) {
  return apiFetch('/contact', {
    method: 'POST',
    body: JSON.stringify({ name, email, message }),
  })
}

export function logout() {
  clearToken()
}
