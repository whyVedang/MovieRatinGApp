import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { FavoriteButton } from "./FavoriteButton";

function MovieCard({ movie }) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <Link to={`/MovieDetail/${movie.id}`} style={{ display: "block" }}>
      <div className="movie-card">
        {/* Poster */}
        <div style={{ position: "relative", aspectRatio: "2/3", overflow: "hidden" }}>
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title || "Movie poster"}
              className="poster-img"
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

          {/* Gradient overlay — shown via CSS :hover on parent */}
          <div
            className="card-overlay"
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 40%, transparent 70%)",
              opacity: 0,
              transition: "opacity 0.3s ease",
              pointerEvents: "none",
            }}
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
      </div>
    </Link>
  );
}

export default MovieCard;