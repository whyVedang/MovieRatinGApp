import React from 'react';
import * as AspectRatio from '@radix-ui/react-aspect-ratio';
import * as Tooltip from '@radix-ui/react-tooltip';
import * as HoverCard from '@radix-ui/react-hover-card';
import { HeartFilledIcon, HeartIcon, StarFilledIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';

function MovieCard({ movie }) {
  const [isFavorite, setIsFavorite] = React.useState(false);

  return (
    <Tooltip.Provider>
      <div className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative">
        {/* Poster Container with Aspect Ratio */}
        <div className="relative">
          <AspectRatio.Root ratio={2 / 3}>
            <img
              src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/api/placeholder/300/450'}
              alt={movie.title || 'Movie poster'}
              className="w-full h-full object-cover"
            />

            {/* Rating Badge */}
            <div className="absolute top-2 left-2 bg-black/70 text-amber-400 px-2 py-1 rounded-md flex items-center gap-1 text-sm backdrop-blur-sm">
              <StarFilledIcon className="w-3 h-3" />
              <span>{movie.vote_average?.toFixed(1) || '?'}</span>
            </div>

            {/* Dark Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Favorite Button */}
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-gray-900/60 rounded-full transform transition-all duration-300 backdrop-blur-sm
                hover:bg-gray-800 active:scale-90"
            >
              {isFavorite ? (
                <HeartFilledIcon className="w-4 h-4 text-rose-500" />
              ) : (
                <HeartIcon className="w-4 h-4 text-gray-300 group-hover:text-white" />
              )}
            </button>
          </AspectRatio.Root>
        </div>

        {/* Card Content */}
        <HoverCard.Root>
          <HoverCard.Trigger asChild>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-white text-lg line-clamp-1 group-hover:text-indigo-400 transition-colors">
                  {movie.title}
                </h2>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <Link to={`/MovieDetail/${movie.id}`} className="text-gray-400 hover:text-indigo-400">
                      <InfoCircledIcon className="w-4 h-4" />
                    </Link>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-gray-900 text-gray-300 px-3 py-1.5 rounded text-xs shadow-lg border border-gray-700"
                      sideOffset={5}
                    >
                      View details
                      <Tooltip.Arrow className="fill-gray-900" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </div>

              <div className="text-gray-400 text-sm mt-1 font-medium">
                {movie.release_date?.substring(0, 4) || 'Unknown year'}
                {movie.runtime && ` • ${movie.runtime} min`}
              </div>

              <div className="mt-2 flex flex-wrap gap-1">
                {movie.genres?.slice(0, 2).map(genre => (
                  <span key={genre.id} className="text-xs px-2 py-0.5 bg-gray-700 text-gray-300 rounded-full">
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>
          </HoverCard.Trigger>

          <HoverCard.Portal>
            <HoverCard.Content
              className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 w-72 z-50"
              sideOffset={5}
              align="center"
            >
              <div className="text-sm text-gray-300 line-clamp-4">
                {movie.overview || 'No description available.'}
              </div>
              <div className="mt-3 text-xs text-gray-400">
                {movie.cast?.slice(0, 3).map(actor => actor.name).join(', ')}
                {movie.cast?.length > 3 && ', and more'}
              </div>
              <HoverCard.Arrow className="fill-gray-900" />
            </HoverCard.Content>
          </HoverCard.Portal>
        </HoverCard.Root>
      </div>
    </Tooltip.Provider>
  );
}

export default MovieCard;