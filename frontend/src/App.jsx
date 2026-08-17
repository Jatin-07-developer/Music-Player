import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Sidebar from './components/Sidebar'
import PlayerBar from './components/PlayerBar'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Albums from './pages/Albums'
import AlbumDetail from './pages/AlbumDetail'
import Upload from './pages/Upload'

function AppShell({ children }) {
  return (
    <div className="shell">
      <Sidebar />
      <main className="main">{children}</main>
      <PlayerBar />
    </div>
  )
}

export default function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute role="user">
            <AppShell>
              <Home />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/albums"
        element={
          <ProtectedRoute role="user">
            <AppShell>
              <Albums />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/albums/:albumId"
        element={
          <ProtectedRoute role="user">
            <AppShell>
              <AlbumDetail />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute role="artist">
            <AppShell>
              <Upload />
            </AppShell>
          </ProtectedRoute>
        }
      />

      <Route
        path="*"
        element={
          user ? (
            <AppShell>
              <p>Page not found.</p>
            </AppShell>
          ) : (
            <Login />
          )
        }
      />
    </Routes>
  )
}
