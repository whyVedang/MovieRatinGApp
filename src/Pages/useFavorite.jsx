import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";


function useFavorite() {
  const queryClient = useQueryClient();
  const getFavourite = () => {
    const store = localStorage.getItem('favourites')
    return store ? JSON.parse(store) : []
  };

  const favQuery = useQuery({
    queryKey: ['favourite'],
    queryFn: getFavourite,
    staleTime: 1000 * 60 * 5, cacheTime: 1000 * 60 * 10,
    onSuccess: (data) => {
      console.log('Fetched favourite data:', data);
    },
  })
  const isFav = (id) => {
    const fav = favQuery.data || []
    return fav.some((item) => item.id === id)
  }
  const UpdateFavorite = (movie) => {
      queryClient.setQueryData(['favourite'], (old = []) => {
      const store = old.some((item) => item.id === movie.id)
      const update = store ? old.filter((item) => item.id !== movie.id) : [...old, movie]
      localStorage.setItem('favourites', JSON.stringify(update))
      return update
    })
  }

  return {
    favorites: favQuery.data || [],
    isLoading: favQuery.isLoading,
    UpdateFavorite: UpdateFavorite,
    isFav
  };
}

export default useFavorite