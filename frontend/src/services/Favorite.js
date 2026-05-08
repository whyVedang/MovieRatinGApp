import { apiHandler } from "./apiHandler";

export const addFavorite = async (movieId) => {
  return await apiHandler(`/favorite`, {
    method: "POST",
    body: JSON.stringify({ movieId }),
    credentials: "include",
  });
};

export const fetchFavorite = async () => {
  return await apiHandler(`/favorite`, {
    method: "GET",
    credentials: "include",
  });
};

export const removeFavorite = async (movieId) => {
  return await apiHandler(`/favorite/${movieId}`, {
    method: "DELETE",
    credentials: "include",
  });
};
