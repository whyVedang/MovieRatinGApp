import React, { useRef } from 'react';
import { Heart } from 'lucide-react';
import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useFavorite from '../Pages/useFavorite';

function MovieCard({ movie }) {
  const { isFav, UpdateFavorite } = useFavorite();

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    UpdateFavorite({
      id: Number(movie.id),
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
    });
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <Link to={`/MovieDetail/${movie.id}`} className="block no-underline">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.25 }}
        className="group relative rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-md hover:shadow-xl transition-all duration-300"
      >

        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title || "Movie poster"}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center text-xs text-gray-400">
              No image
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />

          {/* Rating badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 backdrop-blur text-xs">
            <Star size={10} className="text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-medium">
              {movie.vote_average?.toFixed(1) || "—"}
            </span>
          </div>

          {/* Favorite button */}
          <motion.button
            onClick={handleFavoriteClick}
            whileTap={{ scale: 0.85 }}
            className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full backdrop-blur transition
              ${isFav(movie.id)
                ? "bg-red-500/20 opacity-100"
                : "bg-black/50 opacity-0 group-hover:opacity-100"
              }`}
          >
            <Heart
              size={14}
              className={`${isFav(movie.id) ? "fill-red-500 text-red-500" : "text-white"}`}
            />
          </motion.button>

          {/* Slide-up title */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-sm font-semibold text-white truncate">
              {movie.title}
            </p>
            <p className="text-xs text-gray-300">
              {movie.release_date?.substring(0, 4) || "—"}
            </p>
          </div>
        </div>

        {/* Footer (unchanged logic, cleaner style) */}
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-white truncate">
            {movie.title}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {movie.release_date?.substring(0, 4) || "—"}
          </p>
        </div>

      </motion.div>
    </Link>
  );
}

export default MovieCard;