import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { MutateUserLogin, MutateUserRegister } from "./mutation"; 
import { useNavigate, Link } from "react-router-dom";
import { Film, Eye, EyeOff } from "lucide-react";

function Auth() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationKey: ["Login"],
    mutationFn: MutateUserLogin,
    onSuccess: (data) => {
      localStorage.setItem("movie_mate_token", data.accesstoken);
      navigate("/browse");
    },
    onError: (err) => {
      setError(err.message || "Login failed. Please check your credentials.");
    },
  });

  const registerMutation = useMutation({
    mutationKey: ["Register"],
    mutationFn: MutateUserRegister,
    onSuccess: () => {
      setSuccessMsg("Registration successful! Please check your email to verify your account.");
      setIsRegistering(false);
      setPassword("");
    },
    onError: (err) => setError(err.message || "Registration failed."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (isRegistering) {
      if (!username || !email || !password) return setError("All fields required");
      registerMutation.mutate({ username, email, password });
    } else {
      if (!email || !password) return setError("Email and password required");
      loginMutation.mutate({ email, password });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    background: "var(--bg-elevated)",
    border: "1px solid var(--border-md)",
    borderRadius: "var(--radius-sm)",
    color: "var(--text-1)",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "12px",
    color: "var(--text-3)",
    marginBottom: "8px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
    }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>

        {/* Brand */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "8px" }}>
            <Film size={16} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: "12px", letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--text-3)" }}>
              CineVault
            </span>
          </div>
          <h1 style={{ fontSize: "24px", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--text-1)", margin: 0 }}>
            {isRegistering ? "Create an account" : "Welcome back"}
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-3)", marginTop: "6px" }}>
            {isRegistering ? "Sign up to start your vault" : "Sign in to your account"}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "32px",
        }}>
          {/* Error */}
          {error && (
            <div style={{
              padding: "12px 14px", marginBottom: "20px",
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              borderRadius: "var(--radius-sm)",
              fontSize: "13px", color: "#f87171",
            }}>
              {error}
            </div>
          )}

          {successMsg && <div style={{ color: "#34d399", fontSize: "13px", marginBottom: "16px" }}>{successMsg}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* Username (Only when registering) */}
            {isRegistering && (
              <div>
                <label style={labelStyle}>Username</label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  disabled={isPending}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-md)")}
                />
              </div>
            )}

            {/* Email (Required for both Login and Register) */}
            <div>
              <label style={labelStyle}>Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                disabled={isPending}
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-md)")}
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  disabled={isPending}
                  style={{ ...inputStyle, paddingRight: "44px" }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border-md)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    color: "var(--text-3)", padding: 0,
                  }}
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="btn-primary"
              style={{ width: "100%", justifyContent: "center", opacity: isPending ? 0.6 : 1 }}
            >
              {isPending ? "Processing..." : isRegistering ? "Sign Up" : "Sign In"}
            </button>
          </form>
        </div>

        {/* Toggles */}
        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "var(--text-3)" }}>
          {isRegistering ? "Already have an account? " : "No account? "}
          <button 
            onClick={() => { setIsRegistering(!isRegistering); setError(""); setSuccessMsg(""); }} 
            style={{ color: "var(--accent)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
          >
            {isRegistering ? "Sign in" : "Create one"}
          </button>
        </p>
        
        <p style={{ textAlign: "center", marginTop: "12px" }}>
          <Link
            to="/browse"
            style={{ fontSize: "13px", color: "var(--text-3)", transition: "color 0.15s", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-1)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
          >
            ← Browse without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Auth;