import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Film, Home, AlertTriangle } from "lucide-react";

function NotFound() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-base)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 24px",
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          maxWidth: "420px",
          width: "100%",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          padding: "48px 40px",
          textAlign: "center",
        }}
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, 8, -8, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          style={{
            width: "72px", height: "72px", borderRadius: "50%",
            background: "var(--accent-dim)",
            border: "1px solid rgba(124,58,237,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px",
          }}
        >
          <AlertTriangle size={32} style={{ color: "var(--accent)" }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ fontSize: "56px", fontWeight: 200, color: "var(--text-1)", letterSpacing: "-0.04em", margin: "0 0 8px" }}
        >
          404
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ fontSize: "16px", color: "var(--text-2)", marginBottom: "8px" }}
        >
          Scene not found.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ fontSize: "13px", color: "var(--text-3)", marginBottom: "32px", lineHeight: 1.6 }}
        >
          The page you're looking for doesn't exist or was moved.
        </motion.p>

        <Link to="/browse" className="btn-primary" style={{ justifyContent: "center" }}>
          <Home size={15} />
          Back to Home
        </Link>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}
        >
          <p style={{ fontSize: "11px", color: "var(--text-3)", marginBottom: "12px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Explore
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            {[
              { to: "/category/top_rated", label: "Top Rated" },
              { to: "/category/popular", label: "Popular" },
              { to: "/category/upcoming", label: "Upcoming" },
            ].map(({ to, label }) => (
              <Link
                key={to} to={to}
                style={{ fontSize: "13px", color: "var(--text-3)", transition: "color 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
              >
                {label}
              </Link>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Branding */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        style={{ marginTop: "24px", display: "flex", alignItems: "center", gap: "8px" }}
      >
        <Film size={14} style={{ color: "var(--accent)" }} />
        <span style={{ fontSize: "12px", color: "var(--text-3)", letterSpacing: "0.14em", textTransform: "uppercase" }}>
          CineVault
        </span>
      </motion.div>
    </div>
  );
}

export default NotFound;
