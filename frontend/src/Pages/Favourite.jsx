import { Link } from "react-router-dom";
import { Star, Film, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import useFavorite from "../hooks/useFavorite";
import { fetchMovieDetails } from "../services/Movieapi.js";
import Footer from "../components/Footer";

function FavouriteCard({ favorite }) {
  const { UpdateFavorite } = useFavorite();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await fetchMovieDetails(favorite.movieId);
        setMovie(data);
      } catch (err) {
        console.error(`Failed to fetch movie ${favorite.movieId}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [favorite.movieId]);

  if (loading) {
    return (
      <div style={{
        position: "relative",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        aspectRatio: "2/3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ fontSize: "12px", color: "var(--text-3)" }}>Loading...</div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div style={{
      position: "relative",
      background: "var(--bg-surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-md)",
      overflow: "hidden",
      transition: "border-color 0.2s ease, transform 0.2s ease",
    }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-md)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <Link to={`/MovieDetail/${movie.id}`}>
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ width: "100%", aspectRatio: "2/3", objectFit: "cover", display: "block" }}
          />
        ) : (
          <div style={{
            width: "100%", aspectRatio: "2/3",
            background: "var(--bg-elevated)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Film size={28} style={{ color: "var(--text-3)" }} />
          </div>
        )}
        <div style={{ padding: "12px" }}>
          <h3 style={{
            fontSize: "13px", fontWeight: 500, color: "var(--text-1)",
            margin: "0 0 4px",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>
            {movie.title}
          </h3>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Star size={11} style={{ color: "#facc15", fill: "#facc15" }} />
            <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
              {movie.vote_average?.toFixed(1) || "N/A"}
            </span>
            <span style={{ color: "var(--border-md)" }}>·</span>
            <span style={{ fontSize: "12px", color: "var(--text-3)" }}>
              {movie.release_date ? new Date(movie.release_date).getFullYear() : "N/A"}
            </span>
          </div>
        </div>
      </Link>

      {/* Remove button */}
      <button
        onClick={() => UpdateFavorite({ id: favorite.movieId })}
        style={{
          position: "absolute", top: "8px", right: "8px",
          width: "30px", height: "30px", borderRadius: "50%",
          background: "rgba(239,68,68,0.2)",
          border: "none", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.4)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
        title="Remove from favourites"
      >
        <Heart size={13} style={{ fill: "#ef4444", color: "#ef4444" }} />
      </button>
    </div>
  );
}

function FavouritesPage() {
  const { favorites, isLoading } = useFavorite();

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", paddingTop: "56px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 32px 80px" }}>

        <div style={{ marginBottom: "48px" }}>
          <p className="section-label" style={{ marginBottom: "10px" }}>Your collection</p>
          <h1 style={{
            fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 300,
            letterSpacing: "-0.02em", color: "var(--text-1)", margin: 0,
          }}>
            Favourites
          </h1>
        </div>

        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div className="spinner" />
          </div>
        )}

        {!isLoading && favorites.length === 0 && (
          <div style={{
            padding: "64px 48px", textAlign: "center",
            background: "var(--bg-surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
          }}>
            <Heart size={32} style={{ color: "var(--text-3)", marginBottom: "16px" }} />
            <p style={{ color: "var(--text-2)", marginBottom: "8px", fontSize: "16px" }}>
              No favourites yet.
            </p>
            <p style={{ color: "var(--text-3)", fontSize: "14px", marginBottom: "28px" }}>
              Add movies from any card or detail page.
            </p>
            <Link to="/browse" className="btn-primary">
              Discover Movies
            </Link>
          </div>
        )}

        {!isLoading && favorites.length > 0 && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
            gap: "16px",
          }}>
            {favorites.map((fav) => (
              <FavouriteCard key={fav.id} favorite={fav} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default FavouritesPage;
