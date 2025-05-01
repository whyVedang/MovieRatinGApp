import { Link, useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import { ChevronLeftIcon, ChevronRightIcon, StarFilledIcon, ClockIcon } from "@radix-ui/react-icons";
import { useRef, useEffect, useState } from "react";
import { searchMovies, fetchPopularMovies, fetchTopratedMovies, fetchUpcomingMovies } from "../services/api";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("search") || "";

  // State management for API data - separate states for different categories
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

  // References for scroll containers
  const topRatedRef = useRef(null);
  const popularRef = useRef(null);
  const upcomingRef = useRef(null);

  // Fetch top-rated movies
  useEffect(() => {
    const getTopRatedMovies = async () => {
      try {
        const data = await fetchTopratedMovies();
        setTopRatedMovies(data);
      }
      catch (error) {
        console.error("Error fetching top rated movies:", error);
        setError("Failed to load top rated movies");
      }
      finally {
        setLoading(prev => ({ ...prev, topRated: false }));
      }
    };
    getTopRatedMovies();
  }, []);

  // Fetch popular movies
  useEffect(() => {
    const getPopularMovies = async () => {
      try {
        const data = await fetchPopularMovies();
        setPopularMovies(data);
      }
      catch (error) {
        console.error("Error fetching popular movies:", error);
        setError("Failed to load popular movies");
      }
      finally {
        setLoading(prev => ({ ...prev, popular: false }));
      }
    };
    getPopularMovies();
  }, []);

  // Fetch upcoming movies
  useEffect(() => {
    const getUpcomingMovies = async () => {
      try {
        const data = await fetchUpcomingMovies();
        setUpcomingMovies(data);
      }
      catch (error) {
        console.error("Error fetching upcoming movies:", error);
        setError("Failed to load upcoming movies");
      }
      finally {
        setLoading(prev => ({ ...prev, upcoming: false }));
      }
    };
    getUpcomingMovies();
  }, []);

  // Search functionality
  useEffect(() => {
    const performSearch = async () => {
      if (!searchTerm) {
        setSearchResults([]);
        return;
      }

      setLoading(prev => ({ ...prev, search: true }));

      try {
        const results = await searchMovies(searchTerm);
        setSearchResults(results);
      } catch (error) {
        console.error("Error searching movies:", error);
        setError("Failed to search movies");
      } finally {
        setLoading(prev => ({ ...prev, search: false }));
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(performSearch, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Scroll handlers for horizontal scrolling
  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Check if all initial data is still loading
  const isInitialLoading = loading.topRated && loading.popular && loading.upcoming;

  if (isInitialLoading) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <p className="text-xl">Loading movies...</p>
      </div>
    );
  }

  if (error && !topRatedMovies.length && !popularMovies.length && !upcomingMovies.length) {
    return (
      <div className="bg-gray-900 min-h-screen text-white flex items-center justify-center">
        <p className="text-xl text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white py-8 px-4 md:px-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl md:text-5xl font-black bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent mb-3">
          Discover Amazing Movies
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-8">
          Your ultimate destination for exploring the best of cinema
        </p>

      </div>

      {/* Search Results */}
      {searchTerm && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="mr-2">Search Results for:</span>
            <span className="text-indigo-400">"{searchTerm}"</span>
            {loading.search && <span className="ml-3 text-sm text-gray-400">(Loading...)</span>}
          </h2>

          {!loading.search && searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {searchResults.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : !loading.search ? (
            <div className="text-center py-12 bg-gray-800/50 rounded-xl">
              <p className="text-gray-400 text-lg">No results found for "{searchTerm}"</p>
              <p className="text-gray-500 mt-2">Try a different search term</p>
            </div>
          ) : null}
        </div>
      )}

      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <StarFilledIcon className="mr-2 text-yellow-400" />
            Top Rated Movies
          </h2>
          <div className="flex items-center space-x-4">
            {/* View All Button */}
            <Link
              to="/category/top_rated"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition"
            >
              View All
            </Link>
            {/* Scroll Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => scroll(topRatedRef, 'left')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll(topRatedRef, 'right')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={topRatedRef}
          className="flex overflow-x-auto space-x-6 pb-6 hide-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {topRatedMovies.length > 0 ? (
            topRatedMovies.map((movie) => (
              <div key={movie.id} className="flex-none w-64">
                <MovieCard movie={movie} />
              </div>
            ))
          ) : (
            <div className="flex-none w-full text-center py-12">
              <p className="text-gray-400">No top rated movies available</p>
            </div>
          )}
        </div>
      </div>

      {/* Popular Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <span className="mr-2 text-orange-500">🔥</span>
            Popular Movies
          </h2>
          <div className="flex items-center space-x-4">
            {/* View All Button */}
            <Link
              to="/category/popular"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition"
            >
              View All
            </Link>
            {/* Scroll Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => scroll(popularRef, 'left')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll(popularRef, 'right')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={popularRef}
          className="flex overflow-x-auto space-x-6 pb-6 hide-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {popularMovies.length > 0 ? (
            popularMovies.map((movie) => (
              <div key={movie.id} className="flex-none w-64">
                <MovieCard movie={movie} />
              </div>
            ))
          ) : (
            <div className="flex-none w-full text-center py-12">
              <p className="text-gray-400">No popular movies available</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center">
            <ClockIcon className="mr-2 text-blue-400" />
            Upcoming Movies
          </h2>
          <div className="flex items-center space-x-4">
            {/* View All Button */}
            <Link
              to="/category/upcoming"
              className="text-sm text-indigo-400 hover:text-indigo-300 transition"
            >
              View All
            </Link>
            {/* Scroll Buttons */}
            <div className="flex space-x-2">
              <button
                onClick={() => scroll(upcomingRef, 'left')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll(upcomingRef, 'right')}
                className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={upcomingRef}
          className="flex overflow-x-auto space-x-6 pb-6 hide-scrollbar"
          style={{ scrollbarWidth: 'none' }}
        >
          {upcomingMovies.length > 0 ? (
            upcomingMovies.map((movie) => (
              <div key={movie.id} className="flex-none w-64">
                <MovieCard movie={movie} />
              </div>
            ))
          ) : (
            <div className="flex-none w-full text-center py-12">
              <p className="text-gray-400">No upcoming movies available</p>
            </div>
          )}
        </div>
      </div>

      {/* Add this CSS for hiding scrollbars */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Home;