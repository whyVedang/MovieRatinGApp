
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Film } from 'lucide-react';
import useFavorites from './useFavorite';

function FavoritesPage() {
  const { favorites, isLoading } = useFavorites();
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-16 px-4">
        <div className="container mx-auto py-8">
          <h1 className="text-3xl font-bold mb-8">Your Favourites</h1>
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-t-indigo-500 border-gray-700 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white pt-16 px-4">
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Your Favorite Movies</h1>
        
        {favorites.length === 0 ? (
          <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg p-8 text-center">
            <p className="text-xl text-gray-400">You haven't added any favorites yet.</p>
            <Link to="/" className="mt-4 inline-block px-6 py-3 bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors">
              Discover Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {favorites.map(movie => (
              <motion.div
                key={movie.id}
                whileHover={{ y: -5 }}
                className="bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all"
              >
                <Link to={`/MovieDetail/${movie.id}`}>
                  {movie.poster_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className="w-full h-auto object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                      <Film size={30} className="text-gray-500" />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{movie.title}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <Star size={14} className="text-yellow-400 mr-1" />
                      <span>{movie.vote_average?.toFixed(1) || 'N/A'}</span>
                      <span className="mx-2">•</span>
                      <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritesPage;
