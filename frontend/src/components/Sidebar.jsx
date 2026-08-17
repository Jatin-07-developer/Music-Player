import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark" />
        <div>
          <div className="brand-name">Groove</div>
          <div className="brand-tag">Stream / Deck</div>
        </div>
      </div>

      <nav className="nav-links">
        {user?.role === 'user' && (
          <>
            <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Tracks
            </NavLink>
            <NavLink to="/albums" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              Albums
            </NavLink>
          </>
        )}
        {user?.role === 'artist' && (
          <NavLink to="/upload" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            Upload
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        {user && (
          <>
            <span className="role-pill">{user.role}</span>
            <button className="logout-btn" onClick={handleLogout}>
              {user.username} · Sign out
            </button>
          </>
        )}
      </div>
    </aside>
  )
}
