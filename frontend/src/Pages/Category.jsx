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
  popular: { title: "Popular", fetchFn: fetchPopularMovies },
  upcoming: { title: "Upcoming", fetchFn: fetchUpcomingMovies },
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
    // Replaced inline styles with Tailwind utility classes
    <div className="min-h-screen bg-[var(--bg-base)] pt-14">
      <div className="max-w-[1280px] mx-auto px-8 py-10 pb-20">
        
        {/* Breadcrumb - Removed JS hovers, used Tailwind group/hover */}
        <div className="flex items-center gap-3 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-[var(--text-3)] text-[13px] transition-colors duration-150 hover:text-[var(--text-1)]"
          >
            <ChevronLeft size={14} /> Back
          </button>
          <span className="text-[var(--border-md)] text-[13px]">/</span>
          <span className="text-[13px] text-[var(--text-2)]">{title}</span>
        </div>

        {/* Page heading */}
        <div className="mb-10">
          <p className="section-label mb-2.5">Browse</p>
          <h1 className="text-[clamp(28px,4vw,48px)] font-light tracking-[-0.02em] text-[var(--text-1)] m-0">
            {title}
          </h1>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="spinner" />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-20">
            <p className="text-[var(--text-3)] mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-ghost">
              Try again
            </button>
          </div>
        )}

        {/* Grid & Pagination */}
        {!loading && !error && (
          <>
            {movies.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-4">
                {movies.map((m) => (
                  <div key={m.id} className="movie-card-wrap">
                    <MovieCard movie={m} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 text-[var(--text-3)]">
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