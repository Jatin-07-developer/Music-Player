import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <div className="auth-brand">
          <div className="brand-mark" />
          <div className="brand-name">
            Wave<em>line</em>
          </div>
        </div>
        <h1 className="auth-title">Cue up an account</h1>
        <p className="auth-sub">Listeners stream the crate. Artists press their own records.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="field">
          <label>I am a</label>
          <div className="role-toggle">
            <div
              className={`role-option ${form.role === "user" ? "selected" : ""}`}
              onClick={() => update("role", "user")}
            >
              Listener
            </div>
            <div
              className={`role-option ${form.role === "artist" ? "selected" : ""}`}
              onClick={() => update("role", "artist")}
            >
              Artist
            </div>
          </div>
        </div>

        <div className="field">
          <label>Username</label>
          <input required value={form.username} onChange={(e) => update("username", e.target.value)} placeholder="dj-amara" />
        </div>
        <div className="field">
          <label>Email</label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@waveline.fm"
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            required
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Pressing record…" : "Create account"}
        </button>

        <div className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
