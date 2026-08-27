import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, requireRole }) {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span>WARMING UP THE TUBES…</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (requireRole && user.role !== requireRole) return <Navigate to="/" replace />;

  return children;
}
