import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import MovieCard from "../components/MovieCard";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { fetchTopratedMovies, fetchPopularMovies, fetchUpcomingMovies } from "../services/api";

function Category() {
const { category } = useParams();
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Determine category title and fetch function
    const getCategoryInfo = () => {
        switch (category) {
            case "top_rated":
                return {
                    title: "Top Rated Movies",
                    fetchFunction: fetchTopratedMovies,
                    icon: "⭐"
                };
            case "popular":
                return {
                    title: "Popular Movies",
                    fetchFunction: fetchPopularMovies,
                    icon: "🔥"
                };
            case "upcoming":
                return {
                    title: "Upcoming Movies",
                    fetchFunction: fetchUpcomingMovies,
                    icon: "🕒"
                };
            default:
                return {
                    title: "Movies",
                    fetchFunction: fetchPopularMovies,
                    icon: "🎬"
                };
        }
    };

    const { title, fetchFunction, icon } = getCategoryInfo();

    // Fetch movies for this category
    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const data = await fetchFunction(currentPage);
                setMovies(data);
                setTotalPages(data.total_pages || Math.ceil(data.length / 20));
            } catch (error) {
                console.error(`Error fetching ${category} movies:`, error);
                setError(`Failed to load ${category} movies`);
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [category, currentPage, fetchFunction]);
    // Navigation
    const goBack = () => navigate(-1);
    const goToPage = (page) => setCurrentPage(page);

    return (
        <div className="bg-gray-900 min-h-screen text-white py-8 px-4 md:px-8">
            {/* Header with Back Button */}
            <div className="mb-8 flex items-center justify-between">
                <button
                    onClick={goBack}
                    className="flex items-center text-gray-400 hover:text-white transition"
                >
                    <ArrowLeftIcon className="w-5 h-5 mr-2" />
                    Back
                </button>

                
            </div>

            {/* Category Title */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center">
                    <span className="mr-3">{icon}</span>
                    {title}
                </h1>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="text-center py-12">
                    <p className="text-red-400 text-lg">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {/* Movies Grid */}
            {!loading && !error && (
                <>
                    {movies.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                            {movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-800/50 rounded-xl">
                            <p className="text-gray-400 text-lg">No movies found</p>
                            <p className="text-gray-500 mt-2">Try changing your query</p>
                        </div>
                    )}
                </>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2">
                        <button
                            onClick={() => goToPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className={`px-3 py-2 rounded ${currentPage === 1
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                                }`}
                        >
                            Previous
                        </button>

                        {/* Page Numbers */}
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            // Calculate which page numbers to show
                            let pageNum;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            // Only render if pageNum is valid
                            if (pageNum > 0 && pageNum <= totalPages) {
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => goToPage(pageNum)}
                                        className={`w-10 h-10 rounded-full ${currentPage === pageNum
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-gray-800 hover:bg-gray-700 text-white'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            }
                            return null;
                        })}

                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <>
                                <span className="text-gray-500">...</span>
                                <button
                                    onClick={() => goToPage(totalPages)}
                                    className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 text-white"
                                >
                                    {totalPages}
                                </button>
                            </>
                        )}

                        <button
                            onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className={`px-3 py-2 rounded ${currentPage === totalPages
                                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-800 hover:bg-gray-700 text-white'
                                }`}
                        >
                            Next
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
}

export default Category;