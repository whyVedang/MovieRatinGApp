import dotenv from "dotenv"

dotenv.config()

const API = process.env.TMDB_APIKEY
const AUTHAPI = process.env.TMDB_AUTHKEY
const BASE_URL = 'https://api.themoviedb.org/3/'

if (!API) {
  throw new Error("TMDB_APIKEY is missing in .env");
}

const fetchFromTMDB = async (endpoint) => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}&api_key=${API}`);

    if (!res.ok) {
      throw new Error(`TMDB Error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw new Error(`Error: ${error.message}`);
  }
};


export const fetchTopRatedMovies = async (page = 1) => {
  return fetchFromTMDB(`/movie/top_rated?page=${page}`);
};

export const fetchPopularMovies = async (page = 1) => {
  return fetchFromTMDB(`/movie/popular?page=${page}`);
};

export const fetchUpcomingMovies = async (page = 1) => {
  return fetchFromTMDB(`/movie/upcoming?page=${page}`);
};

export const fetchSearchMovies = async (query, page = 1) => {
  if (!query) throw new Error("Search query is required");

  const encodedQuery = encodeURIComponent(query);

  return fetchFromTMDB(
    `/search/movie?query=${encodedQuery}&page=${page}`
  );
};

export const fetchMovieDetails = async (movieId) => {
  if (!movieId) throw new Error("Movie ID is required");

  return fetchFromTMDB(`/movie/${movieId}?`);
};

export const fetchMovieCredits = async (movieId) => {
  if (!movieId) throw new Error("Movie ID is required");

  return fetchFromTMDB(`/movie/${movieId}/credits?`);
};

export const fetchMovieRecommendations = async (movieId, page = 1) => {
  if (!movieId) throw new Error("Movie ID is required");

  return fetchFromTMDB(
    `/movie/${movieId}/recommendations?page=${page}`
  );
};


export const fetchMovieReviews = async (movieId, page = 1) => {
  if (!movieId) throw new Error("Movie ID is required");

  return fetchFromTMDB(
    `/movie/${movieId}/reviews?page=${page}`
  );
};