import { Film } from "lucide-react";

export default function Footer() {
  return (
    <footer style={{
      borderTop: "1px solid var(--border)",
      padding: "28px 40px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: "12px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <Film size={13} style={{ color: "var(--accent)" }} />
        <span style={{
          fontSize: "12px", color: "var(--text-3)",
          letterSpacing: "0.14em", textTransform: "uppercase",
        }}>
          CineVault
        </span>
      </div>
      <p style={{ fontSize: "12px", color: "var(--text-3)", margin: 0 }}>
        Powered by{" "}
        <a
          href="https://www.themoviedb.org"
          target="_blank"
          rel="noreferrer"
          style={{ color: "var(--text-2)", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-2)")}
        >
          TMDB
        </a>
      </p>
    </footer>
  );
}
