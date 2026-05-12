
import { useEffect, useState, useRef } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { verifyEmailToken } from "../services/auth.js";
import { CheckCircle, XCircle, Film } from "lucide-react";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token found in the URL.");
      return;
    }

    if (!hasFetched.current) {
      hasFetched.current = true;
      verifyEmailToken(token)
        .then(() => {
          setStatus("success");
          setMessage("Your email has been successfully verified!");
        })
        .catch((err) => {
          setStatus("error");
          setMessage(err.message || "Verification failed. The link may have expired.");
        });
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center p-6">
      <div className="w-full max-w-[400px] text-center">
        {/* Brand */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Film size={18} className="text-[var(--accent)]" />
          <span className="text-[14px] tracking-[0.22em] uppercase text-[var(--text-3)] font-medium">
            CineVault
          </span>
        </div>

        {/* Status Card */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-2xl p-10 flex flex-col items-center">
          
          {status === "loading" && (
            <>
              <div className="spinner mb-6" style={{ width: "48px", height: "48px", borderWidth: "3px" }} />
              <h2 className="text-xl font-light text-[var(--text-1)] mb-2">Verifying your email</h2>
              <p className="text-sm text-[var(--text-3)]">Please wait a moment...</p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h2 className="text-xl font-light text-[var(--text-1)] mb-3">Verification Complete!</h2>
              <p className="text-sm text-[var(--text-3)] mb-8">{message}</p>
              <Link to="/login" className="btn-primary w-full justify-center">
                Go to Login
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                <XCircle size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl font-light text-[var(--text-1)] mb-3">Verification Failed</h2>
              <p className="text-sm text-[var(--text-3)] mb-8">{message}</p>
              <Link to="/login" className="btn-ghost w-full justify-center">
                Back to Login
              </Link>
            </>
          )}

        </div>
      </div>
    </div>
  );
}