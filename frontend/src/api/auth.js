import api from './client'

export function register({ username, email, password, role }) {
  return api.post('/auth/register', { username, email, password, role })
}

export function login({ identifier, password }) {
  // identifier can be a username or an email — the backend accepts either
  const isEmail = identifier.includes('@')
  const payload = isEmail
    ? { email: identifier, password }
    : { username: identifier, password }
  return api.post('/auth/login', payload)
}

export function logout() {
  return api.post('/auth/logout')
}
