import { useMutation } from "@tanstack/react-query";
import { MutateLogout } from "./mutation";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationKey: ["Logout"],
    mutationFn: MutateLogout,
    onSuccess: () => navigate("/login"),
    onError: (err) => console.error("Logout error:", err),
  });

  const sessionId = localStorage.getItem("movie_mate_token");
  if (!sessionId) return null;

  return (
    <button
      onClick={() => mutate()}
      disabled={isPending}
      style={{
        padding: "6px 14px",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border-md)",
        background: "transparent",
        color: "var(--text-3)",
        fontSize: "12px",
        cursor: isPending ? "not-allowed" : "pointer",
        transition: "border-color 0.15s, color 0.15s",
        opacity: isPending ? 0.5 : 1,
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "#ef4444"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-md)"; e.currentTarget.style.color = "var(--text-3)"; }}
    >
      {isPending ? "…" : "Logout"}
    </button>
  );
}

export default LogoutButton;