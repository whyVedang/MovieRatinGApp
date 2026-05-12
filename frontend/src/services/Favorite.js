import { apiHandler } from "./apiHandler";

export const addFavorite = async (movieId) => {
  return await apiHandler(`/favorite`, {
    method: "POST",
    body: JSON.stringify({ movieId }),
    credentials: "include",
  });
};

export const fetchFavorite = async () => {
  const response= await apiHandler(`/favorite`, {
    method: "GET",
    credentials: "include",
  });

  return response?.favorites || []
};

export const removeFavorite = async (movieId) => {
  return await apiHandler(`/favorite/${movieId}`, {
    method: "DELETE",
    credentials: "include",
  });
};
