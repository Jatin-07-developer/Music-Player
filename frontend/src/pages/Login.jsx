import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ identifier: "", password: "" });
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
      const isEmail = form.identifier.includes("@");
      await login({
        [isEmail ? "email" : "username"]: form.identifier,
        password: form.password,
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't sign you in. Check your details.");
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
        <h1 className="auth-title">Welcome back on air</h1>
        <p className="auth-sub">Sign in to pick up where the needle left off.</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="field">
          <label>Username or email</label>
          <input
            required
            value={form.identifier}
            onChange={(e) => update("identifier", e.target.value)}
            placeholder="dj-amara"
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
          {loading ? "Tuning in…" : "Sign in"}
        </button>

        <div className="auth-switch">
          New to Waveline? <Link to="/register">Create an account</Link>
        </div>
      </form>
    </div>
  );
}
