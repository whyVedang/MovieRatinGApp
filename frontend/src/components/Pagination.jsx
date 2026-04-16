import { ChevronLeft, ChevronRight } from "lucide-react";

const btnBase = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "8px 14px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-md)",
  background: "transparent",
  color: "var(--text-2)",
  fontSize: "13px",
  cursor: "pointer",
  transition: "border-color 0.2s ease, color 0.2s ease",
};

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const pages = [];
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + 4);
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      gap: "8px", marginTop: "56px", flexWrap: "wrap",
    }}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        style={{ ...btnBase, opacity: currentPage <= 1 ? 0.35 : 1 }}
        onMouseEnter={(e) => { if (currentPage > 1) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-md)"; e.currentTarget.style.color = "var(--text-2)"; }}
      >
        <ChevronLeft size={14} />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            ...btnBase,
            minWidth: "38px",
            background: currentPage === p ? "var(--accent)" : "transparent",
            borderColor: currentPage === p ? "var(--accent)" : "var(--border-md)",
            color: currentPage === p ? "#fff" : "var(--text-2)",
            fontWeight: currentPage === p ? 600 : 400,
          }}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        style={{ ...btnBase, opacity: currentPage >= totalPages ? 0.35 : 1 }}
        onMouseEnter={(e) => { if (currentPage < totalPages) { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-md)"; e.currentTarget.style.color = "var(--text-2)"; }}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}