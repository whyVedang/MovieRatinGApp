import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMovieCredits, fetchMovieDetails, fetchMovieRecommendation, fetchMovieReviews } from '../services/api';
import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { Star, Clock, Calendar, Globe, Tag, Heart, ArrowLeft, ArrowRight, Film, Users, MessageSquare, ChevronDown, User } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';

function MovieDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [recommendations, setRecommendations] = useState({});
  const [credits, setCredits] = useState({});
  const [reviews, setReviews] = useState({});
  const [expandedReviews, setExpandedReviews] = useState([]);
  const [userRating, setUserRating] = useState(() => {
    return Number(localStorage.getItem(`rating_${id}`)) || 0;
  });
  const [isFavorite, setIsFavorite] = useState(false);

  const handleRating = (value) => {
    setUserRating(value);
    localStorage.setItem(`rating_${id}`, value);
  };
  useEffect(() => {
    const getMovieDetail = async () => {
      setLoading(true);
      try {
        const data = await fetchMovieDetails(id);
        setDetails(data);
        console.log(data);
      }
      catch (error) {
        console.error('Error fetching movie details:', error);
      }
      finally {
        setLoading(false);
      }
    };
    getMovieDetail();
  }, [id]);


  useEffect(() => {
    const getMovieCredits = async () => {
      setLoading(true);
      try {
        const data = await fetchMovieCredits(id);
        setCredits(data);
        console.log(credits);
      }
      catch (error) {
        console.error('Error fetching movie details:', error);
      }
      finally {
        setLoading(false);
      }
    };
    getMovieCredits();
  }, [id]);

  useEffect(() => {
    const getMovieReviews = async () => {
      setLoading(true);
      try {
        const data = await fetchMovieReviews(id);
        setReviews(data);
        console.log(data);
      }
      catch (error) {
        console.error('Error fetching movie details:', error);
      }
      finally {
        setLoading(false);
      }
    };
    getMovieReviews();
  }, [id]);

  useEffect(() => {
    const getMovieRecommendation = async () => {
      setLoading(true);
      try {
        const data = await fetchMovieRecommendation(id);
        setRecommendations(data);
        console.log(data);
      }
      catch (error) {
        console.error('Error fetching movie recommendations:', error);
      }
      finally {
        setLoading(false);
      }
    };
    getMovieRecommendation();
  }, [id]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    console.log(`Movie ${id} favorite status: ${!isFavorite}`);
  };

  const toggleReviewExpansion = (reviewId) => {
    setExpandedReviews(prev =>
      prev.includes(reviewId)
        ? prev.filter(id => id !== reviewId)
        : [...prev, reviewId]
    );
  };
  const formatDate = (dateString) => {
    if (!dateString) return 'No date available';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Framer Motion variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900 text-white">
        <div className="flex-grow flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center"
          >
            <div className="w-12 h-12 border-4 border-t-indigo-500 border-gray-700 rounded-full animate-spin mb-4"></div>
            <p className="text-lg">Loading movie details...</p>
          </motion.div>
        </div>
      </div>
    );
  }
  // <Star
  //   fill={(hoverRating || userRating) >= star ? '#FACC15' : 'none'}
  //   stroke={(hoverRating || userRating) >= star ? '#FACC15' : '#94A3B8'}
  //   size={24}
  //   className="transition-all duration-200"
  // />
  // Star Rating Component
  const StarRating = () => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Tooltip.Provider key={star}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ scale: 1 }}
                  animate={{
                    scale: (hoverRating || userRating) >= star ? [1, 1.2, 1] : 1,
                    transition: { duration: 0.3 }
                  }}
                  onClick={() => handleRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    fill={(hoverRating || userRating) >= star ? '#FACC15' : 'none'}
                    stroke={(hoverRating || userRating) >= star ? '#FACC15' : '#94A3B8'}
                    size={24}
                    className="transition-all duration-200"
                  />
                </motion.button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-gray-800 text-white px-2 py-1 rounded text-xs"
                  sideOffset={5}
                >
                  {star} Star{star > 1 ? 's' : ''}
                  <Tooltip.Arrow className="fill-gray-800" />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        ))}
        <span className="ml-2 text-gray-300 font-medium">
          {userRating > 0 ? `Your rating: ${userRating}/5` : "Rate this movie"}
        </span>
      </div>
    );
  };

  // Genre Badge Component
  const GenreBadge = ({ name }) => (
    <motion.span
      whileHover={{ scale: 1.05, backgroundColor: "rgba(79, 70, 229, 0.6)" }}
      className="cursor-pointer inline-flex items-center ml-1.5 px-3 py-1 rounded-full text-sm font-medium bg-indigo-900/40 text-indigo-200 border border-indigo-700 mr-2 mb-2"
    >
      {name}
    </motion.span>
  );

  return (
    <Tooltip.Provider>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      >
        {/* Backdrop Image */}
        {details.backdrop_path && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${details.backdrop_path})`,
              filter: 'blur(3px)'
            }}
          />
        )}

        <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
          {/* Back Button */}
          <motion.button
            variants={itemVariants}
            whileHover={{ x: -5 }}
            onClick={() => window.history.back()}
            className="flex items-center text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            <span>Back to Movies</span>
          </motion.button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Movie Poster */}
            <motion.div
              variants={itemVariants}
              className="lg:w-1/3"
            >
              {details.poster_path ? (
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="rounded-lg overflow-hidden shadow-2xl border-2 border-gray-700"
                >
                  <img
                    src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
                    alt={details.title || 'Movie poster'}
                    className="w-full h-auto object-cover"
                  />
                </motion.div>
              ) : (
                <div className="rounded-lg overflow-hidden shadow-2xl bg-gray-800 flex items-center justify-center h-96 border-2 border-gray-700">
                  <p className="text-gray-500">No poster available</p>
                </div>
              )}

              {/* Action Buttons */}
              <motion.div
                variants={itemVariants}
                className="mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFavoriteClick}
                  className={`flex items-center justify-center gap-2 w-full py-3 px-4 rounded-md transition-colors ${isFavorite
                    ? 'bg-pink-700 hover:bg-pink-800 text-white'
                    : 'bg-pink-600 hover:bg-pink-700 text-white'
                    }`}
                >
                  <Heart size={18} fill={isFavorite ? "white" : "none"} />
                  <span>{isFavorite ? 'Added to Favorites' : 'Add to Favorites'}</span>
                </motion.button>
              </motion.div>

              {/* Movie Info Card */}
              <motion.div
                variants={itemVariants}
                className="mt-6 bg-gray-800/70 backdrop-blur-sm rounded-lg p-5 border border-gray-700"
              >
                <h3 className="text-lg font-semibold mb-4 text-gray-200">Movie Info</h3>

                <div className="space-y-4 text-sm">
                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <Calendar className="text-indigo-400 mt-0.5 mr-3 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-gray-400 font-medium">Release Date</p>
                      <p className="text-gray-200">{formatDate(details.release_date)}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <Clock className="text-indigo-400 mt-0.5 mr-3 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-gray-400 font-medium">Runtime</p>
                      <p className="text-gray-200">
                        {details.runtime ? `${Math.floor(details.runtime / 60)}h ${details.runtime % 60}m` : 'Not available'}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <Globe className="text-indigo-400 mt-0.5 mr-3 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-gray-400 font-medium">Language</p>
                      <p className="text-gray-200">
                        {details.original_language ? details.original_language.toUpperCase() : 'Not available'}
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="flex items-start"
                  >
                    <Star className="text-indigo-400 mt-0.5 mr-3 flex-shrink-0" size={16} />
                    <div>
                      <p className="text-gray-400 font-medium">IMDB Rating</p>
                      <p className="text-gray-200">
                        {details.vote_average ? (
                          <span className="flex items-center">
                            {details.vote_average.toFixed(1)}/10
                            <span className="text-gray-500 ml-2 text-xs">
                              ({details.vote_count?.toLocaleString() || 0} votes)
                            </span>
                          </span>
                        ) : 'Not rated'}
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>

            {/* Movie Details */}
            <div className="lg:w-2/3">
              <motion.h1
                variants={itemVariants}
                className="text-4xl font-bold mb-2"
              >
                {details.title || 'No title available'}
              </motion.h1>

              {details.tagline && (
                <motion.p
                  variants={itemVariants}
                  className="text-lg text-indigo-400 italic mb-4"
                >
                  "{details.tagline}"
                </motion.p>
              )}

              {/* Genres */}
              {details.genres && details.genres.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="text-lg text-indigo-400 italic flex flex-wrap mb-2 mt-2"
                >
                  Genre Tags:
                  {details.genres.map(genre => (
                    <GenreBadge key={genre.id} name={genre.name} />
                  ))}
                </motion.div>
              )}
              {details.production_companies && details.production_companies.length > 0 && (
                <motion.p
                  variants={itemVariants}
                  className="text-lg text-indigo-400 italic mb-4"
                >
                  Produced by :
                  {details.production_companies.map(pc => (
                    <GenreBadge key={pc.id} name={pc.name} />
                  ))}
                </motion.p>
              )}


              {/* Overview */}
              <motion.div
                variants={itemVariants}
                className="mb-8"
              >
                <h2 className="text-xl font-semibold mb-3 flex items-center">
                  <Tag size={18} className="mr-2 text-indigo-400" />
                  Overview
                </h2>
                <p className="text-gray-300 leading-relaxed">
                  {details.overview || 'No overview available'}
                </p>
              </motion.div>

              {/* User Rating */}
              <motion.div
                variants={itemVariants}
                className="bg-gray-800/70 backdrop-blur-sm p-6 rounded-lg border border-gray-700 mb-8"
              >
                <h2 className="text-xl font-semibold mb-4">Rate this movie</h2>
                <StarRating />
              </motion.div>
              {recommendations?.results?.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="mb-10"
                >
                  <h2 className="text-xl font-semibold mb-5 flex items-center">
                    <Film size={18} className="mr-2 text-indigo-400" />
                    You Might Also Like
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {recommendations.results
                      .sort((a, b) => {
                        const scoreA = a.popularity * 0.7 + a.vote_average * 0.3;
                        const scoreB = b.popularity * 0.7 + b.vote_average * 0.3;
                        return scoreB - scoreA;
                      })
                      .slice(0, 4)
                      .map((movie) => (
                        <motion.div
                          key={movie.id}
                          whileHover={{
                            y: -5,
                            transition: { duration: 0.2 }
                          }}
                          className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all"
                        >
                          <Link to={`/MovieDetail/${movie.id}`}>
                            {movie.poster_path ? (
                              <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                className="w-full h-48 object-cover"
                              />
                            ) : (
                              <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
                                <Film size={30} className="text-gray-500" />
                              </div>
                            )}
                            <div className="p-3">
                              <h3 className="font-medium text-sm line-clamp-1">{movie.title}</h3>
                              <div className="flex items-center mt-1">
                                <Star size={12} className="text-yellow-400 mr-1" />
                                <span className="text-xs text-gray-400">
                                  {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                                </span>
                                <span className="mx-2 text-gray-600">•</span>
                                <span className="text-xs text-gray-400">
                                  {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}
              {/* Cast Section */}
              <motion.div variants={itemVariants} className="mb-10">
                <h2 className="text-xl font-semibold mb-5 flex items-center">
                  <Users size={18} className="mr-2 text-indigo-400" />
                  Top Cast
                </h2>

                <div className="relative">
                  {/* Grid layout instead of horizontal scroll */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {credits?.cast?.slice(0, 12).map((actor) => (
                      <motion.div
                        key={actor.id}
                        whileHover={{ y: -5 }}
                        className="bg-gray-800 rounded-lg border border-gray-700 hover:border-indigo-500 transition-all"
                      >
                        {actor.profile_path ? (
                          <img
                            src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                            alt={actor.name}
                            className="w-full h-[160px] object-cover rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-[160px] bg-gray-700 flex items-center justify-center rounded-t-lg">
                            <User size={40} className="text-gray-500" />
                          </div>
                        )}
                        <div className="cursor-pointer p-2 text-sm">
                          <p className="font-semibold truncate text-white">{actor.name}</p>
                          <p className="text-gray-400 truncate">as {actor.character}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>


              {reviews?.results?.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="mb-10"
                >
                  <h2 className="text-xl font-semibold mb-5 flex items-center">
                    <MessageSquare size={18} className="mr-2 text-indigo-400" />
                    User Reviews
                  </h2>

                  <div className="space-y-4">
                    {reviews.results.slice(0, 3).map((review) => {
                      const isExpanded = expandedReviews.includes(review.id);
                      const reviewContent = review.content || '';
                      const shouldShowReadMore = reviewContent.length > 300;

                      return (
                        <motion.div
                          key={review.id}
                          whileHover={{
                            boxShadow: "0 0 0 1px rgba(99, 91, 255, 0.3)",
                          }}
                          className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-5 border border-gray-700 transition-all"
                        >
                          <div className="flex items-center mb-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold mr-3">
                              {review.author?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <h4 className="font-semibold">{review.author}</h4>
                              <div className="flex items-center text-xs text-gray-400">
                                <p>
                                  {new Date(review.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric', month: 'short', day: 'numeric'
                                  })}
                                </p>
                                {review.author_details?.rating && (
                                  <>
                                    <span className="mx-2">•</span>
                                    <div className="flex items-center">
                                      <Star size={12} className="text-yellow-400 mr-1" fill="#FACC15" />
                                      <span>{review.author_details.rating}/10</span>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-gray-300 text-sm leading-relaxed">
                            {shouldShowReadMore && !isExpanded
                              ? `${reviewContent.substring(0, 300)}...`
                              : reviewContent}
                          </div>

                          {shouldShowReadMore && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => toggleReviewExpansion(review.id)}
                              className="mt-2 text-indigo-400 text-sm flex items-center"
                            >
                              <span>{isExpanded ? 'Show less' : 'Read more'}</span>
                              <ChevronDown
                                size={14}
                                className={`ml-1 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              />
                            </motion.button>
                          )}
                        </motion.div>
                      );
                    })}

                    {reviews.results.length > 3 && (
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="text-center"
                      >
                        <Link
                          to={`/movie/${id}/reviews`}
                          className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-700/50 hover:bg-indigo-700 text-white text-sm transition-colors"
                        >
                          View all {reviews.results.length} reviews
                          <ArrowRight size={14} className="ml-2" />
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
      <div>

      </div>
    </Tooltip.Provider>
  );
}

export default MovieDetail;