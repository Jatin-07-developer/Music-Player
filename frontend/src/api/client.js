import axios from 'axios'

// The backend issues an auth cookie rather than a bearer token, so every
// request must be sent with credentials so the browser attaches it.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
})

export default api
