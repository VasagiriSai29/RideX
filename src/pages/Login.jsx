import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/Authprovider";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, googleSignIn, authLoading, actionLoading } = useAuth();


  const from = location.state?.from || "/dashboard";

  // UI-only fields (for Dribbble look)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaInput, setCaptchaInput] = useState("");
  const captchaText = useMemo(() => "O S F 1 Z B", []);

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const handleGoogle = async () => {
    try {
      await googleSignIn();
      // redirect happens in useEffect when user is set
    } catch (e) {
      console.error(e);
      alert("Google sign-in failed. Please try again.");
    }
  };

  const emailLoginEnabled = false;
  const handleEmailLogin = (e) => {
    e.preventDefault();
    alert("Email/Password login is not enabled yet. Use Google sign-in for now.");
  };

  return (
    <div className="auth-bg">
      <div className="login-card">
        <div className="card-head">
          <div>
            <h1 className="title">Welcome Back!</h1>
            <p className="subtitle">
              Track your rides, earnings, and pending payments — all in one place.
            </p>
          </div>
          <button className="close-btn" onClick={() => navigate("/login")} aria-label="Close">
            ×
          </button>
        </div>

        <button className="google-btn" onClick={handleGoogle} disabled={authLoading || actionLoading}>
  <span className="google-mark">G</span>
  {actionLoading ? "Signing in..." : "Login with Google"}
</button>


        <div className="divider">or</div>

        <form onSubmit={handleEmailLogin}>
          <div className="field">
            <div className="label">Username or Email</div>
            <input
              className="input"
              placeholder="Your Username or Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="field">
            <div className="label">Password</div>
            <input
              className="input"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
            />
          </div>

          <div className="field">
            <div className="label">Captcha V4.0</div>
            <div className="captcha-box">
              <div className="captcha-top">{captchaText}</div>
              <input
                className="captcha-input"
                placeholder="Type captcha here"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
              />
            </div>
          </div>

          <button className="primary-btn" type="submit" disabled={!emailLoginEnabled}>
            Login
          </button>
        </form>

        <div className="footer">
          Doesn&apos;t have an account?{" "}
          <span onClick={() => alert("Signup later 😉")}>Sign Up here</span>
        </div>
      </div>
    </div>
  );
}
