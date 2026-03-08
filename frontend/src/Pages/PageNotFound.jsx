import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Film, Home, Search, AlertTriangle } from 'lucide-react';

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-lg p-8 border border-gray-700 shadow-xl"
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="w-24 h-24 bg-indigo-600/20 rounded-full flex items-center justify-center"
          >
            <AlertTriangle size={50} className="text-indigo-400" />
          </motion.div>
        </div>

        <motion.h1
          className="text-4xl font-bold text-center mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          404
        </motion.h1>

        <motion.p
          className="text-xl text-center text-gray-300 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          The scene you're looking for isn't in our collection.
        </motion.p>

        <motion.p
          className="text-gray-400 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          The page you requested could not be found. It might have been moved, deleted, or never existed in the first place.
        </motion.p>

        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/"
              className="flex items-center justify-center gap-2 py-3 px-6 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
            >
              <Home size={18} />
              <span>Home</span>
            </Link>
          </motion.div>
        </div>


        <div className="mt-8 pt-6 border-t border-gray-700">
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <p className="text-sm text-gray-500">Popular pages:</p>
            <Link to="/category/trending" className="text-sm text-indigo-400 hover:text-indigo-300">Trending</Link>
            <Link to="/category/top-rated" className="text-sm text-indigo-400 hover:text-indigo-300">Top Rated</Link>
            <Link to="/category/upcoming" className="text-sm text-indigo-400 hover:text-indigo-300">Upcoming</Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-8 flex items-center"
      >
        <Film size={20} className="text-indigo-500 mr-2" />
        <span className="text-gray-400">MovieRatingApp</span>
      </motion.div>
    </div>
  );
}

export default NotFound;
