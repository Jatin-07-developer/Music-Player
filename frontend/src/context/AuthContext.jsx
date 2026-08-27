import { createContext, useContext, useEffect, useState } from "react";
import { authApi } from "../api/client";

const AuthContext = createContext(null);
const STORAGE_KEY = "waveline_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // The backend has no "/me" endpoint, so we trust the last known session
    // (stored client-side) and let any 401 from a real request log us out.
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setReady(true);
  }, []);

  function persist(u) {
    setUser(u);
    if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(STORAGE_KEY);
  }

  async function login(payload) {
    const { data } = await authApi.login(payload);
    persist(data.user);
    return data.user;
  }

  async function register(payload) {
    const { data } = await authApi.register(payload);
    persist(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      persist(null);
    }
  }

  function forceLogout() {
    persist(null);
  }

  return (
    <AuthContext.Provider value={{ user, ready, login, register, logout, forceLogout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
