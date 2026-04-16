import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FavoriteButton } from "./FavoriteButton";

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <Link to={`/MovieDetail/${movie.id}`} style={{ display: "block" }}>
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.22 }}
        style={{
          position: "relative",
          borderRadius: "var(--radius-md)",
          overflow: "hidden",
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          transition: "border-color 0.2s ease, box-shadow 0.2s ease",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--border-md)";
          e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        {/* Poster */}
        <div style={{ position: "relative", aspectRatio: "2/3", overflow: "hidden" }}>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title || "Movie poster"}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block",
                transition: "transform 0.3s ease" }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            />
          ) : (
            <div style={{
              width: "100%", height: "100%",
              background: "var(--bg-elevated)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", color: "var(--text-3)",
            }}>
              No image
            </div>
          )}

          {/* Gradient overlay */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)",
            opacity: 0, transition: "opacity 0.3s ease",
          }}
            className="card-overlay"
          />

          {/* Rating badge */}
          <div style={{
            position: "absolute", top: "8px", left: "8px",
            display: "flex", alignItems: "center", gap: "4px",
            padding: "3px 8px", borderRadius: "20px",
            background: "rgba(0,0,0,0.72)", backdropFilter: "blur(4px)",
          }}>
            <Star size={10} style={{ color: "#facc15", fill: "#facc15" }} />
            <span style={{ fontSize: "11px", color: "#facc15", fontWeight: 600 }}>
              {movie.vote_average?.toFixed(1) || "—"}
            </span>
          </div>

          {/* Favorite button */}
          <div style={{ position: "absolute", top: "8px", right: "8px" }}>
            <FavoriteButton movieId={movie.id} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "10px 12px" }}>
          <p style={{
            fontSize: "13px", fontWeight: 500, color: "var(--text-1)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            margin: 0,
          }}>
            {movie.title}
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "3px", margin: 0 }}>
            {movie.release_date?.substring(0, 4) || "—"}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}

export default MovieCard;