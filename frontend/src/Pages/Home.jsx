import { Link, useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import {
  fetchSearchMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies,
} from "../services/Movieapi.js";
import Footer from "../components/Footer";

function MovieRow({ title, movies, rowRef, onScrollLeft, onScrollRight, categoryPath }) {
  return (
    <div style={{ marginBottom: "56px" }}>
      {/* Row header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: 600, color: "var(--text-1)", letterSpacing: "-0.01em", margin: 0 }}>
          {title}
        </h2>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            to={categoryPath}
            style={{ fontSize: "12px", color: "var(--text-3)", transition: "color 0.15s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-3)")}
          >
            View all →
          </Link>
          <button onClick={onScrollLeft} style={scrollBtnStyle}>
            <ChevronLeft size={14} />
          </button>
          <button onClick={onScrollRight} style={scrollBtnStyle}>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Horizontal scroll row */}
      <div
        ref={rowRef}
        className="scrollbar-hide"
        style={{ display: "flex", gap: "14px", overflowX: "auto" }}
      >
        {movies.map((m) => (
          <div key={m.id} style={{ flexShrink: 0, width: "160px" }}>
            <MovieCard movie={m} />
          </div>
        ))}
      </div>
    </div>
  );
}

const scrollBtnStyle = {
  width: "28px", height: "28px",
  borderRadius: "50%",
  border: "1px solid var(--border-md)",
  background: "transparent",
  color: "var(--text-2)",
  cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center",
  transition: "border-color 0.15s, color 0.15s",
};

function Home() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [topRated, setTopRated] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loadingRows, setLoadingRows] = useState(true);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const topRatedRef = useRef(null);
  const popularRef = useRef(null);
  const upcomingRef = useRef(null);

  const scroll = (ref, dir) =>
    ref.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });

  /* ── Initial load — all three rows in one shot ── */
  useEffect(() => {
    setLoadingRows(true);
    Promise.all([
      fetchTopRatedMovies(1),
      fetchPopularMovies(1),
      fetchUpcomingMovies(1),
    ])
      .then(([tr, pop, up]) => {
        setTopRated(tr.results || []);
        setPopular(pop.results || []);
        setUpcoming(up.results || []);
      })
      .finally(() => setLoadingRows(false));
  }, []);

  /* ── Search ── */
  useEffect(() => {
    if (!searchTerm) { setSearchResults([]); return; }
    const t = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const data = await fetchSearchMovies(searchTerm);
        setSearchResults(data.results || []);
      } catch (err) { 
        console.error("Search error:", err);
        setSearchResults([]);
      }
      finally { setLoadingSearch(false); }
    }, 400);
    return () => clearTimeout(t);
  }, [searchTerm]);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", paddingTop: "56px" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>

        {/* ── Hero text (no search) ── */}
        {!searchTerm && !loadingRows && (
          <div style={{ padding: "56px 0 48px" }}>
            <p className="section-label" style={{ marginBottom: "12px" }}>Film Discovery</p>
            <h1 style={{
              fontSize: "clamp(36px, 5vw, 72px)", fontWeight: 300,
              letterSpacing: "-0.03em", lineHeight: 1.05,
              color: "var(--text-1)", margin: "0 0 16px",
            }}>
              Discover Movies
            </h1>
            <p style={{ fontSize: "14px", color: "var(--text-3)", maxWidth: "340px", margin: 0 }}>
              Your destination for exploring the best of cinema.
            </p>
          </div>
        )}

        {/* ── Search results ── */}
        {searchTerm && (
          <div style={{ padding: "48px 0" }}>
            <h2 style={{ color: "var(--text-1)", fontWeight: 500, marginBottom: "28px", fontSize: "18px" }}>
              Results for "{searchTerm}"
            </h2>
            {loadingSearch ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
                <div className="spinner" />
              </div>
            ) : searchResults.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: "16px" }}>
                {searchResults.map((m) => <MovieCard key={m.id} movie={m} />)}
              </div>
            ) : (
              <p style={{ color: "var(--text-3)" }}>No results found.</p>
            )}
          </div>
        )}

        {/* ── Movie rows ── */}
        {!searchTerm && (
          <>
            {loadingRows ? (
              <div style={{ display: "flex", justifyContent: "center", padding: "96px 0" }}>
                <div className="spinner" />
              </div>
            ) : (
              <div style={{ paddingBottom: "64px" }}>
                <MovieRow
                  title="Top Rated"
                  movies={topRated}
                  rowRef={topRatedRef}
                  onScrollLeft={() => scroll(topRatedRef, "left")}
                  onScrollRight={() => scroll(topRatedRef, "right")}
                  categoryPath="/category/top_rated"
                />
                <MovieRow
                  title="Popular"
                  movies={popular}
                  rowRef={popularRef}
                  onScrollLeft={() => scroll(popularRef, "left")}
                  onScrollRight={() => scroll(popularRef, "right")}
                  categoryPath="/category/popular"
                />
                <MovieRow
                  title="Upcoming"
                  movies={upcoming}
                  rowRef={upcomingRef}
                  onScrollLeft={() => scroll(upcomingRef, "left")}
                  onScrollRight={() => scroll(upcomingRef, "right")}
                  categoryPath="/category/upcoming"
                />
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Home;