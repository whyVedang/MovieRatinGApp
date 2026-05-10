import { Link, useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { fetchSearchMovies, fetchPopularMovies, fetchTopRatedMovies, fetchUpcomingMovies } from "../services/Movieapi.js";
import Footer from "../components/Footer";

function MovieRow({ title, movies, rowRef, onScrollLeft, onScrollRight, categoryPath }) {
  return (
    <div className="mb-14">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-[16px] font-semibold text-[var(--text-1)] tracking-tight m-0">
          {title}
        </h2>
        <div className="flex items-center gap-3">
          <Link to={categoryPath} className="text-xs text-[var(--text-3)] transition-colors hover:text-[var(--accent)]">
            View all →
          </Link>
          <button onClick={onScrollLeft} className="w-7 h-7 rounded-full border border-[var(--border-md)] bg-transparent text-[var(--text-2)] cursor-pointer flex items-center justify-center transition-colors hover:border-[var(--accent)] hover:text-[var(--text-1)]">
            <ChevronLeft size={14} />
          </button>
          <button onClick={onScrollRight} className="w-7 h-7 rounded-full border border-[var(--border-md)] bg-transparent text-[var(--text-2)] cursor-pointer flex items-center justify-center transition-colors hover:border-[var(--accent)] hover:text-[var(--text-1)]">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
      <div ref={rowRef} className="flex gap-3.5 overflow-x-auto scrollbar-hide scroll-smooth">
        {movies.map((m) => (
          <div key={m.id} className="shrink-0 w-[160px]">
            <MovieCard movie={m} />
          </div>
        ))}
      </div>
    </div>
  );
}

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

  const scroll = (ref, dir) => ref.current?.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });

  useEffect(() => {
    setLoadingRows(true);
    Promise.all([fetchTopRatedMovies(1), fetchPopularMovies(1), fetchUpcomingMovies(1)])
      .then(([tr, pop, up]) => {
        setTopRated(tr.results || []);
        setPopular(pop.results || []);
        setUpcoming(up.results || []);
      })
      .finally(() => setLoadingRows(false));
  }, []);

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
    <div className="min-h-screen bg-[var(--bg-base)] pt-14">
      <div className="max-w-[1280px] mx-auto px-8">

        {/* Hero text (no search) */}
        {!searchTerm && !loadingRows && (
          <div className="py-14 pb-12">
            <p className="section-label mb-3">Film Discovery</p>
            <h1 className="text-[clamp(36px,5vw,72px)] font-light tracking-tight leading-[1.05] text-[var(--text-1)] m-0 mb-4">
              Discover Movies
            </h1>
            <p className="text-sm text-[var(--text-3)] max-w-[340px] m-0">
              Your destination for exploring the best of cinema.
            </p>
          </div>
        )}

        {/* Search results */}
        {searchTerm && (
          <div className="py-12">
            <h2 className="text-[var(--text-1)] font-medium mb-7 text-lg">Results for "{searchTerm}"</h2>
            {loadingSearch ? (
              <div className="flex justify-center py-12"><div className="spinner" /></div>
            ) : searchResults.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(155px,1fr))] gap-4">
                {searchResults.map((m) => <MovieCard key={m.id} movie={m} />)}
              </div>
            ) : (
              <p className="text-[var(--text-3)]">No results found.</p>
            )}
          </div>
        )}

        {/* Movie rows */}
        {!searchTerm && (
          <>
            {loadingRows ? (
              <div className="flex justify-center py-24"><div className="spinner" /></div>
            ) : (
              <div className="pb-16">
                <MovieRow title="Top Rated" movies={topRated} rowRef={topRatedRef} onScrollLeft={() => scroll(topRatedRef, "left")} onScrollRight={() => scroll(topRatedRef, "right")} categoryPath="/category/top_rated" />
                <MovieRow title="Popular" movies={popular} rowRef={popularRef} onScrollLeft={() => scroll(popularRef, "left")} onScrollRight={() => scroll(popularRef, "right")} categoryPath="/category/popular" />
                <MovieRow title="Upcoming" movies={upcoming} rowRef={upcomingRef} onScrollLeft={() => scroll(upcomingRef, "left")} onScrollRight={() => scroll(upcomingRef, "right")} categoryPath="/category/upcoming" />
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