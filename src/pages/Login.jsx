// src/pages/Login.jsx  — works with the real MERN backend
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../services/api"; // adjust path if needed

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/");
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      let data;
      if (mode === "signup") {
        data = await authAPI.register({ name, email, password });
      } else {
        data = await authAPI.login({ email, password });
      }

      // Save token + user to localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (m) => {
    setMode(m);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .auth-root {
          min-height: 100vh;
          background: #f5f5f7;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Inter', sans-serif;
          padding: 16px;
        }

        .auth-card {
          background: #ffffff;
          border-radius: 20px;
          width: 100%;
          max-width: 400px;
          padding: 40px 36px 36px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 16px 48px rgba(0,0,0,0.09);
        }

        .tabs {
          display: flex;
          background: #f0f0f2;
          border-radius: 10px;
          padding: 4px;
          margin-bottom: 32px;
        }
        .tab {
          flex: 1;
          padding: 9px;
          text-align: center;
          font-size: 14px;
          font-weight: 500;
          color: #888;
          border-radius: 7px;
          cursor: pointer;
          border: none;
          background: none;
          transition: all 0.2s;
          font-family: 'Inter', sans-serif;
        }
        .tab.active {
          background: #fff;
          color: #111;
          box-shadow: 0 1px 4px rgba(0,0,0,0.1);
        }

        .auth-title {
          font-size: 22px;
          font-weight: 700;
          color: #111;
          margin-bottom: 4px;
          letter-spacing: -0.3px;
        }
        .auth-sub {
          font-size: 13.5px;
          color: #999;
          margin-bottom: 28px;
        }

        .field { margin-bottom: 16px; }
        .field label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #444;
          margin-bottom: 6px;
        }
        .input-wrap { position: relative; }
        .input-wrap input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e8e8ec;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #111;
          background: #fafafa;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .input-wrap input:focus {
          border-color: #6366f1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
        }
        .input-wrap input.pw-input { padding-right: 42px; }
        .toggle-pw {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: #aaa;
          display: flex;
          padding: 2px;
          transition: color 0.15s;
        }
        .toggle-pw:hover { color: #6366f1; }

        .error-box {
          background: #fff5f5;
          border: 1px solid #fecaca;
          border-radius: 9px;
          padding: 10px 13px;
          font-size: 13px;
          color: #dc2626;
          margin-bottom: 16px;
        }

        .forgot {
          text-align: right;
          margin-top: -8px;
          margin-bottom: 22px;
        }
        .forgot a {
          font-size: 12.5px;
          color: #6366f1;
          text-decoration: none;
          cursor: pointer;
        }
        .forgot a:hover { text-decoration: underline; }

        .btn-main {
          width: 100%;
          padding: 12px;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 14.5px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.18s, transform 0.15s, box-shadow 0.18s;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .btn-main:hover:not(:disabled) {
          background: #4f46e5;
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(99,102,241,0.45);
        }
        .btn-main:active:not(:disabled) { transform: translateY(0); }
        .btn-main:disabled { opacity: 0.7; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.35);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .divider {
          display: flex; align-items: center; gap: 12px;
          margin: 22px 0;
        }
        .div-line { flex: 1; height: 1px; background: #ebebeb; }
        .div-text { font-size: 12px; color: #bbb; }

        .social-row { display: flex; gap: 10px; }
        .btn-social {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 7px;
          padding: 10px;
          background: #fff;
          border: 1.5px solid #e8e8ec;
          border-radius: 10px;
          font-family: 'Inter', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          color: #333;
          cursor: pointer;
          transition: border-color 0.18s, background 0.18s, transform 0.15s;
        }
        .btn-social:hover {
          border-color: #d0d0d8;
          background: #fafafa;
          transform: translateY(-1px);
        }
        .btn-social svg { width: 17px; height: 17px; flex-shrink: 0; }

        .auth-footer {
          margin-top: 24px;
          text-align: center;
          font-size: 13px;
          color: #aaa;
        }
        .auth-footer span {
          color: #6366f1;
          font-weight: 500;
          cursor: pointer;
        }
        .auth-footer span:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-root">
        <div className="auth-card">
          <div className="tabs">
            <button className={`tab${mode === "login" ? " active" : ""}`} onClick={() => switchMode("login")}>
              Sign In
            </button>
            <button className={`tab${mode === "signup" ? " active" : ""}`} onClick={() => switchMode("signup")}>
              Sign Up
            </button>
          </div>

          <h1 className="auth-title">
            {mode === "login" ? "Welcome back 👋" : "Create account"}
          </h1>
          <p className="auth-sub">
            {mode === "login"
              ? "Enter your credentials to continue."
              : "Fill in the details below to get started."}
          </p>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-box">{error}</div>}

            {mode === "signup" && (
              <div className="field">
                <label>Full Name</label>
                <div className="input-wrap">
                  <input type="text" placeholder="John Doe" value={name}
                    onChange={(e) => setName(e.target.value)} autoComplete="name" />
                </div>
              </div>
            )}

            <div className="field">
              <label>Email</label>
              <div className="input-wrap">
                <input type="email" placeholder="you@example.com" value={email}
                  onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={mode === "signup" ? "Min. 6 characters" : "Enter your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pw-input"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                />
                <button type="button" className="toggle-pw" onClick={() => setShowPassword(v => !v)} tabIndex={-1}>
                  {showPassword ? (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {mode === "login" && (
              <div className="forgot"><a href="#">Forgot password?</a></div>
            )}

            <button type="submit" className="btn-main" disabled={isLoading}>
              {isLoading ? (
                <><span className="spinner" /> {mode === "login" ? "Signing in…" : "Creating account…"}</>
              ) : (
                mode === "login" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          <div className="divider">
            <div className="div-line" /><span className="div-text">or</span><div className="div-line" />
          </div>

          <div className="social-row">
            <button className="btn-social" type="button">
              <svg viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button className="btn-social" type="button">
              <svg viewBox="0 0 24 24" fill="#333">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          <p className="auth-footer">
            {mode === "login" ? (
              <>Don't have an account? <span onClick={() => switchMode("signup")}>Sign up</span></>
            ) : (
              <>Already have an account? <span onClick={() => switchMode("login")}>Sign in</span></>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
