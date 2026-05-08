import { apiHandler } from "./apiHandler";

export const writeReview = async ({ movieId, rating, content }) => {
  return await apiHandler(`/movies/${movieId}/reviews`, {
    method: "POST",
    body: JSON.stringify({
      movieId: Number(movieId),
      rating: Number(rating),
      content,
    }),
    credentials: "include",
  });
};

export const getMovieReviews = async (movieId) => {
  return await apiHandler(`/movies/${movieId}/reviews`);
};

export const getAllMyReview = async (movieId) => {
  return await apiHandler(`/reviews/me`, {
    credentials: "include",
  });
};

export const deleteReview = async ({ movieId, reviewId }) => {
  return await apiHandler(`/movies/${movieId}/reviews/${reviewId}`, {
    method: "DELETE",
    credentials: "include",
  });
};
