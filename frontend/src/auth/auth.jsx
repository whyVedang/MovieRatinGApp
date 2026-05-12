import { useMutation } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { MutateUserLogin, MutateUserRegister } from "./mutation";
import { useNavigate, Link } from "react-router-dom";
import { Film, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Auth() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const loginMutation = useMutation({
    mutationKey: ["Login"],
    mutationFn: MutateUserLogin,
    onSuccess: (data) => {
      login(data.accesstoken);
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
      setSuccessMsg("Registration successful! Please check your email.");
      setIsRegistering(false);
      if (passwordRef.current) passwordRef.current.value = "";
    },
    onError: (err) => setError(err.message || "Registration failed."),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const email = emailRef.current?.value || "";
    const password = passwordRef.current?.value || "";
    const username = usernameRef.current?.value || "";

    if (isRegistering) {
      if (!username || !email || !password) return setError("All fields required");
      registerMutation.mutate({ username, email, password });
    } else {
      if (!email || !password) return setError("Email and password required");
      loginMutation.mutate({ email, password });
    }
  };

  const isPending = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6">
      <div className="w-full max-w-[380px]">
        {/* ... [Brand Header Code] ... */}

        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-8">
          {error && (
            <div className="p-3 mb-5 bg-red-500/10 border border-red-500/20 rounded-md text-[13px] text-red-400">
              {error}
            </div>
          )}
          {successMsg && <div className="text-emerald-400 text-[13px] mb-4">{successMsg}</div>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {isRegistering && (
              <div>
                <label className="block text-[12px] text-[var(--text-3)] mb-2 tracking-widest uppercase">Username</label>
                <input
                  ref={usernameRef}
                  type="text"
                  placeholder="Username"
                  disabled={isPending}
                  className="w-full p-3 bg-[var(--bg-elevated)] border border-[var(--border-md)] rounded-md text-[var(--text-1)] text-[14px] outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-[12px] text-[var(--text-3)] mb-2 tracking-widest uppercase">Email</label>
              <input
                ref={emailRef}
                type="email"
                placeholder="name@example.com"
                disabled={isPending}
                className="w-full p-3 bg-[var(--bg-elevated)] border border-[var(--border-md)] rounded-md text-[var(--text-1)] text-[14px] outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[12px] text-[var(--text-3)] mb-2 tracking-widest uppercase">Password</label>
              <div className="relative">
                <input
                  ref={passwordRef}
                  type={showPw ? "text" : "password"}
                  placeholder="Password"
                  disabled={isPending}
                  className="w-full p-3 pr-11 bg-[var(--bg-elevated)] border border-[var(--border-md)] rounded-md text-[var(--text-1)] text-[14px] outline-none focus:border-[var(--accent)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-none text-[var(--text-3)] cursor-pointer"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className={`btn-primary w-full justify-center ${isPending ? 'opacity-60' : ''}`}
            >
              {isPending ? "Processing..." : isRegistering ? "Sign Up" : "Sign In"}
            </button>
          </form>
        </div>

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