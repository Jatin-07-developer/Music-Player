import axios from "axios";

// Point this at your Express backend (see .env.example).
// The backend reads FRONTEND_URL for CORS and expects cookies (credentials),
// so we keep withCredentials true everywhere.
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
});

export const authApi = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload),
  logout: () => api.post("/auth/logout"),
};

export const musicApi = {
  getAllMusics: () => api.get("/music"),
  getAllAlbums: () => api.get("/music/albums"),
  getAlbumById: (albumId) => api.get(`/music/albums/${albumId}`),
  uploadMusic: (formData) =>
    api.post("/music/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  createAlbum: (payload) => api.post("/music/album", payload),
};

export default api;
