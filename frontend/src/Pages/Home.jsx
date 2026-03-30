import { Link, useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useRef, useEffect, useState } from "react";
import {
  fetchSearchMovies,
  fetchPopularMovies,
  fetchTopRatedMovies,
  fetchUpcomingMovies
} from "../services/Movieapi.js";

function Home() {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  const [loading, setLoading] = useState({
    topRated: true,
    popular: true,
    upcoming: true,
    search: false
  });

  const [error, setError] = useState(null);

  const topRatedRef = useRef(null);
  const popularRef = useRef(null);
  const upcomingRef = useRef(null);

  /* ───────── Fetching (UNCHANGED) ───────── */

  useEffect(() => {
    fetchTopRatedMovies(1)
      .then(data => setTopRatedMovies(data.results || []))
      .catch(() => setError("Failed to load top rated"))
      .finally(() => setLoading(p => ({ ...p, topRated: false })));
  }, []);

  useEffect(() => {
    fetchPopularMovies(1)
      .then(data => setPopularMovies(data.results || []))
      .catch(() => setError("Failed to load popular"))
      .finally(() => setLoading(p => ({ ...p, popular: false })));
  }, []);

  useEffect(() => {
    fetchUpcomingMovies(1)
      .then(data => setUpcomingMovies(data.results || []))
      .catch(() => setError("Failed to load upcoming"))
      .finally(() => setLoading(p => ({ ...p, upcoming: false })));
  }, []);

  useEffect(() => {
    const t = setTimeout(async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      setLoading(p => ({ ...p, search: true }));

      try {
        const results = await fetchSearchMovies(searchTerm);
        setSearchResults(results);
      } catch {
        setError("Search failed");
      } finally {
        setLoading(p => ({ ...p, search: false }));
      }
    }, 500);

    return () => clearTimeout(t);
  }, [searchTerm]);

  const scroll = (ref, dir) => {
    ref.current?.scrollBy({
      left: dir === "left" ? -360 : 360,
      behavior: "smooth"
    });
  };

  /* ───────── Styles ───────── */

  const btnStyle = {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text-2)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-base)", paddingTop: "80px" }}>

      {/* ── HERO ── */}
      {!searchTerm && (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 32px 64px" }}>
          <p style={{
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "var(--text-3)",
            marginBottom: "16px"
          }}>
            Film Discovery
          </p>

          <h1 style={{
            fontSize: "clamp(40px, 6vw, 80px)",
            fontWeight: 300,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "var(--text-1)"
          }}>
            Discover Movies
          </h1>

          <p style={{
            marginTop: "20px",
            fontSize: "14px",
            color: "var(--text-2)",
            maxWidth: "380px"
          }}>
            Your ultimate destination for exploring the best of cinema
          </p>
        </div>
      )}

      {/* ── SEARCH ── */}
      {searchTerm && (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px 64px" }}>
          <h2 style={{ color: "var(--text-1)", marginBottom: "24px" }}>
            "{searchTerm}"
          </h2>

          {!loading.search && searchResults.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "16px"
            }}>
              {searchResults.map(m => (
                <MovieCard key={m.id} movie={m} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── SECTIONS ── */}
      {!searchTerm && (
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px" }}>

          {/* Top Rated */}
          <div style={{ marginBottom: "56px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ color: "var(--text-1)" }}>Top Rated</h2>

              <div style={{ display: "flex", gap: "8px" }}>
                <Link to="/category/top_rated" style={{ color: "var(--text-3)" }}>
                  View all →
                </Link>

                <button onClick={() => scroll(topRatedRef, "left")} style={btnStyle}>
                  <ChevronLeftIcon />
                </button>
                <button onClick={() => scroll(topRatedRef, "right")} style={btnStyle}>
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            <div ref={topRatedRef} style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
              {topRatedMovies.map(m => (
                <div key={m.id} style={{ flexShrink: 0, width: "200px" }}>
                  <MovieCard movie={m} />
                </div>
              ))}
            </div>
          </div>

          {/* Popular */}
          <div style={{ marginBottom: "56px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ color: "var(--text-1)" }}>Popular</h2>

              <div style={{ display: "flex", gap: "8px" }}>
                <Link to="/category/popular" style={{ color: "var(--text-3)" }}>
                  View all →
                </Link>

                <button onClick={() => scroll(popularRef, "left")} style={btnStyle}>
                  <ChevronLeftIcon />
                </button>
                <button onClick={() => scroll(popularRef, "right")} style={btnStyle}>
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            <div ref={popularRef} style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
              {popularMovies.map(m => (
                <div key={m.id} style={{ flexShrink: 0, width: "200px" }}>
                  <MovieCard movie={m} />
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming */}
          <div style={{ marginBottom: "56px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ color: "var(--text-1)" }}>Upcoming</h2>

              <div style={{ display: "flex", gap: "8px" }}>
                <Link to="/category/upcoming" style={{ color: "var(--text-3)" }}>
                  View all →
                </Link>

                <button onClick={() => scroll(upcomingRef, "left")} style={btnStyle}>
                  <ChevronLeftIcon />
                </button>
                <button onClick={() => scroll(upcomingRef, "right")} style={btnStyle}>
                  <ChevronRightIcon />
                </button>
              </div>
            </div>

            <div ref={upcomingRef} style={{ display: "flex", gap: "16px", overflowX: "auto" }}>
              {upcomingMovies.map(m => (
                <div key={m.id} style={{ flexShrink: 0, width: "200px" }}>
                  <MovieCard movie={m} />
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}

export default Home;