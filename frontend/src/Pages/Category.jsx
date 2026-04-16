import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { ChevronLeft } from "lucide-react";
import {
  fetchTopRatedMovies,
  fetchPopularMovies,
  fetchUpcomingMovies,
} from "../services/Movieapi.js";
import Pagination from "../components/Pagination";
import Footer from "../components/Footer";

const CATEGORY_MAP = {
  top_rated: { title: "Top Rated", fetchFn: fetchTopRatedMovies },
  popular:   { title: "Popular",   fetchFn: fetchPopularMovies },
  upcoming:  { title: "Upcoming",  fetchFn: fetchUpcomingMovies },
};

function Category() {
  const { category } = useParams();
  const navigate = useNavigate();

  const { title = "Movies", fetchFn = fetchPopularMovies } =
    CATEGORY_MAP[category] || {};

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchFn(currentPage)
      .then((data) => {
        setMovies(data.results || []);
        setTotalPages(Math.min(data.total_pages || 0, 500));
      })
      .catch(() => setError(`Failed to load ${title}`))
      .finally(() => setLoading(false));
  }, [category, currentPage, fetchFn, title]);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", paddingTop: "56px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* Breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "48px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-3)", fontSize: "13px",
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-1)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
          >
            <ChevronLeft size={14} /> Back
          </button>
          <span style={{ color: "var(--border-md)", fontSize: "13px" }}>/</span>
          <span style={{ fontSize: "13px", color: "var(--text-2)" }}>{title}</span>
        </div>

        {/* Page heading */}
        <div style={{ marginBottom: "40px" }}>
          <p className="section-label" style={{ marginBottom: "10px" }}>Browse</p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--text-1)", margin: 0 }}>
            {title}
          </h1>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
            <div className="spinner" />
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{ color: "var(--text-3)", marginBottom: "16px" }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-ghost"
            >
              Try again
            </button>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && (
          <>
            {movies.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))",
                gap: "16px",
              }}>
                {movies.map((m) => (
                  <div key={m.id} className="movie-card-wrap">
                    <MovieCard movie={m} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "80px 0", color: "var(--text-3)" }}>
                No movies found.
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Category;