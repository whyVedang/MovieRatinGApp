import * as tmdbService from "../services/tmdb.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const TopRatedMovies = asyncHandler(async (req, res) => {
    const page = req.query.page;
    if (page && page < 1) throw new AppError("Invalid page number", 400);

    const data = await tmdbService.fetchTopRatedMovies(page);
    res.status(200).json(data);
});

export const PopularMovies = asyncHandler(async (req, res) => {
    const page = req.query.page;
    if (page && page < 1) throw new AppError("Invalid page number", 400);

    const data = await tmdbService.fetchPopularMovies(page);
    res.status(200).json(data);
});

export const UpcomingMovies = asyncHandler(async (req, res) => {
    const page = req.query.page || 1;
    if (page < 1) throw new AppError("Invalid page number", 400);

    const data = await tmdbService.fetchUpcomingMovies(page);
    res.status(200).json(data);
});

export const SearchMovies = asyncHandler(async (req, res) => {
    const search = req.query.query?.trim();
    if (!search) throw new AppError("Search query is required", 400);

    const data = await tmdbService.fetchSearchMovies(search);
    res.status(200).json(data);
});

export const MovieDetails = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) throw new AppError("Movie ID is required", 400);

    const data = await tmdbService.fetchMovieDetails(id);
    res.status(200).json(data);
});

export const MovieCredits = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) throw new AppError("Movie ID is required", 400);

    const data = await tmdbService.fetchMovieCredits(id);
    res.status(200).json(data);
});

export const MovieRecommendations = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) throw new AppError("Movie ID is required", 400);

    const data = await tmdbService.fetchMovieRecommendations(id);
    res.status(200).json(data);
});