import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchFavorite, addFavorite, removeFavorite } from "../services/Favorite.js";
import {useAuth} from "../context/AuthContext.jsx";

const QUERY_KEY = ["favorites"];

function useFavorite() {
  const queryClient = useQueryClient();
  const {isAuthenticated} = useAuth();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: QUERY_KEY,
    queryFn: fetchFavorite,
    retry: false,
    staleTime: 1000 * 60 * 2,
    enabled: isAuthenticated,
  });

  const isFav = (id) => favorites.some((item) => (item.movieId) === (id));

  const UpdateFavorite = async (movie) => {
    const already = isFav(movie.id);
  queryClient.setQueryData(QUERY_KEY, (old = []) =>
      already
        ? old.filter((item) => (item.movieId) !== movie.id)
        : [...old, { movieId: movie.id, ...movie }]
    );

    try {
      if (already) {
        await removeFavorite(movie.id);
      } else {
        await addFavorite(movie.id);
      }
    } catch {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    }
  };

  return { favorites, isLoading, isFav, UpdateFavorite };
}

export default useFavorite;