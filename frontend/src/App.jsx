import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PlayerProvider } from "./context/PlayerContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import PlayerBar from "./components/PlayerBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Albums from "./pages/Albums";
import AlbumDetail from "./pages/AlbumDetail";
import Upload from "./pages/Upload";

function AppShell({ children }) {
  return (
    <div className="shell">
      <Sidebar />
      <main className="shell-main">{children}</main>
      <PlayerBar />
    </div>
  );
}

function RedirectIfAuthed({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <RedirectIfAuthed>
            <Login />
          </RedirectIfAuthed>
        }
      />
      <Route
        path="/register"
        element={
          <RedirectIfAuthed>
            <Register />
          </RedirectIfAuthed>
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell>
              <Home />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/albums"
        element={
          <ProtectedRoute>
            <AppShell>
              <Albums />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/albums/:albumId"
        element={
          <ProtectedRoute>
            <AppShell>
              <AlbumDetail />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute requireRole="artist">
            <AppShell>
              <Upload />
            </AppShell>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <PlayerProvider>
        <div className="grain" />
        <AppRoutes />
      </PlayerProvider>
    </AuthProvider>
  );
}
