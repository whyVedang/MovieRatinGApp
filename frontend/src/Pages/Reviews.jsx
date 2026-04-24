import { Link } from "react-router-dom";
import { Star, Film, Trash2, Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllMyReview, deleteReview } from "../services/Review";
import { fetchMovieDetails } from "../services/Movieapi.js";
import Footer from "../components/Footer";

function ReviewCard({ review }) {
  const queryClient = useQueryClient();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const data = await fetchMovieDetails(review.movieId);
        setMovie(data);
      } catch (err) {
        console.error(`Failed to fetch movie ${review.movieId}:`, err);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [review.movieId]);

  const deleteMutate = useMutation({
    mutationFn: deleteReview,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["myReviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", variables.movieId] });
    },
  });

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    deleteMutate.mutate({ movieId: review.movieId, reviewId: review.id });
  };

  if (loading) {
    return (
      <div style={{
        position: "relative",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        height: "180px", // Fixed height for horizontal loading skeleton
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ fontSize: "14px", color: "var(--text-3)" }}>Loading...</div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div
      style={{
        position: "relative",
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        transition: "border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease",
        height: "180px", // Standardized height for the horizontal card
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-md)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        if (isConfirming) setIsConfirming(false);
      }}
    >
      {/* Changed Link to display: flex to sit the poster 
        and the content side-by-side 
      */}
      <Link 
        to={`/MovieDetail/${movie.id}`} 
        style={{ 
          display: "flex", 
          height: "100%", 
          textDecoration: "none", 
          color: "inherit" 
        }}
      >
        {/* Left Side: Poster */}
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ 
              width: "120px", 
              minWidth: "120px", 
              objectFit: "cover", 
              display: "block" 
            }}
          />
        ) : (
          <div style={{
            width: "120px", 
            minWidth: "120px",
            background: "var(--bg-elevated)",
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
          }}>
            <Film size={28} style={{ color: "var(--text-3)" }} />
          </div>
        )}

        {/* Right Side: Content */}
        <div style={{ 
          padding: "16px", 
          display: "flex", 
          flexDirection: "column", 
          flex: 1, 
          overflow: "hidden" 
        }}>
          <h3 style={{
            fontSize: "18px", 
            fontWeight: 600, 
            color: "var(--text-1)",
            margin: "0 0 8px",
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis",
            paddingRight: "36px" // Prevents text from hiding behind the delete button
          }}>
            {movie.title}
          </h3>

          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
            <Star size={14} style={{ color: "#facc15", fill: "#facc15" }} />
            <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-2)" }}>
              {review.rating} / 5
            </span>
          </div>

          <p style={{
            fontSize: "14px", 
            color: "var(--text-2)", 
            margin: 0,
            lineHeight: 1.6,
            display: "-webkit-box", 
            WebkitLineClamp: 3, // Allow more lines since we have horizontal space
            WebkitBoxOrient: "vertical", 
            overflow: "hidden",
          }}>
            "{review.content}"
          </p>
        </div>
      </Link>

      {/* Delete button (Unchanged positioning, just fits nicely in top right) */}
      <div style={{
        position: "absolute", top: "12px", right: "12px",
        display: "flex", gap: "4px", zIndex: 10,
      }}>
        {isConfirming ? (
          <>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsConfirming(false); }}
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(107,114,128,0.9)", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}
            >
              <X size={14} style={{ color: "white" }} />
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteMutate.isPending}
              style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(239,68,68,0.9)", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)",
              }}
            >
              {deleteMutate.isPending
                ? <span style={{ fontSize: "10px", color: "white" }}>...</span>
                : <Check size={14} style={{ color: "white" }} />}
            </button>
          </>
        ) : (
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsConfirming(true); }}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              background: "rgba(239,68,68,0.1)", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
            title="Delete review"
          >
            <Trash2 size={15} style={{ color: "#ef4444" }} />
          </button>
        )}
      </div>
    </div>
  );
}

function ReviewsPage() {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["myReviews"],
    queryFn: getAllMyReview,
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", paddingTop: "56px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 32px 80px" }}>

        <div style={{ marginBottom: "48px" }}>
          <p className="section-label" style={{ marginBottom: "10px" }}>Your Voice</p>
          <h1 style={{
            fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 300,
            letterSpacing: "-0.02em", color: "var(--text-1)", margin: 0,
          }}>
            My Reviews
          </h1>
        </div>

        {isLoading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div className="spinner" />
          </div>
        )}

        {!isLoading && reviews.length === 0 && (
          <div style={{
            padding: "64px 48px", textAlign: "center",
            background: "var(--bg-surface)", border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
          }}>
            <Star size={32} style={{ color: "var(--text-3)", marginBottom: "16px" }} />
            <p style={{ color: "var(--text-2)", marginBottom: "8px", fontSize: "16px" }}>
              No reviews yet.
            </p>
            <p style={{ color: "var(--text-3)", fontSize: "14px", marginBottom: "28px" }}>
              Watch a movie and share what you think.
            </p>
            <Link to="/browse" className="btn-primary">
              Discover Movies
            </Link>
          </div>
        )}

        {!isLoading && reviews.length > 0 && (
          <div style={{
            display: "grid",
            // Adjusted grid to accommodate wider, horizontal cards
            gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))", 
            gap: "24px",
          }}>
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default ReviewsPage;