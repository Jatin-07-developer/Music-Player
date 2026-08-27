import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  const initial = (user?.username || "?").charAt(0).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div className="brand-name">
          Wave<em>line</em>
        </div>
      </div>

      <div className="nav-group">
        <div className="nav-label">Listen</div>
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-icon">◎</span> Library
        </NavLink>
        <NavLink to="/albums" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
          <span className="nav-icon">▦</span> Albums
        </NavLink>
      </div>

      {user?.role === "artist" && (
        <div className="nav-group">
          <div className="nav-label">Studio</div>
          <NavLink to="/upload" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            <span className="nav-icon">▲</span> Upload
          </NavLink>
        </div>
      )}

      <div className="sidebar-foot">
        <div className="user-chip">
          <div className="user-avatar">{initial}</div>
          <div className="user-meta">
            <div className="user-name">{user?.username}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </aside>
  );
}
