import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import {
  fetchTopRatedMovies,
  fetchPopularMovies,
  fetchUpcomingMovies
} from "../services/Movieapi.js";
import Pagination from "../components/Pagination";

function Category() {
  const { category } = useParams();
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const goBack = () => navigate(-1);

  /* ───────── Category Config (UNCHANGED) ───────── */
  const getCategoryInfo = () => {
    switch (category) {
      case "top_rated":
        return { title: "Top Rated", fetchFunction: fetchTopRatedMovies };
      case "popular":
        return { title: "Popular", fetchFunction: fetchPopularMovies };
      case "upcoming":
        return { title: "Upcoming", fetchFunction: fetchUpcomingMovies };
      default:
        return { title: "Movies", fetchFunction: fetchPopularMovies };
    }
  };

  const { title, fetchFunction } = getCategoryInfo();

  /* ───────── Fetch (UNCHANGED) ───────── */
  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchFunction(currentPage);
        setMovies(data.results || []);
        setTotalPages(data.total_pages || 0);
      } catch {
        setError(`Failed to load ${title}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [category, currentPage, fetchFunction]);

  const handlePageChange = (p) => {
    if (p >= 1 && p <= totalPages) {
      setCurrentPage(p);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", paddingTop: "80px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 32px 80px" }}>

        {/* ── Header ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          marginBottom: "48px"
        }}>
          <button
            onClick={goBack}
            style={{
              color: "var(--text-3)",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px"
            }}
          >
            <ArrowLeftIcon /> Back
          </button>

          <span style={{ color: "var(--border-md)", fontSize: "14px" }}>/</span>

          <h1 style={{
            fontSize: "14px",
            fontWeight: 500,
            color: "var(--text-1)",
            letterSpacing: "-0.01em"
          }}>
            {title}
          </h1>
        </div>

        {/* ── Title ── */}
        <div style={{ marginBottom: "48px", textAlign: "center" }}>
          <h2 style={{
            fontSize: "28px",
            fontWeight: 600,
            color: "var(--text-1)"
          }}>
            {title}
          </h2>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div style={{
            textAlign: "center",
            padding: "80px 0",
            color: "var(--text-3)"
          }}>
            Loading…
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <p style={{
              color: "var(--text-3)",
              marginBottom: "16px"
            }}>
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              style={{
                padding: "8px 20px",
                borderRadius: "6px",
                border: "1px solid var(--border-md)",
                background: "transparent",
                color: "var(--text-2)",
                cursor: "pointer"
              }}
            >
              Try again
            </button>
          </div>
        )}

        {/* ── Grid ── */}
        {!loading && !error && (
          <>
            {movies.length > 0 ? (
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "16px"
              }}>
                {movies.map(m => (
                  <div key={m.id} className="movie-card-wrap">
                    <MovieCard movie={m} />
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: "center",
                padding: "80px 0",
                color: "var(--text-3)"
              }}>
                No movies found
              </div>
            )}

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Category;