import * as tmdbService from "../services/tmdb.js";
import { AppError } from "../utils/AppError.js";

export const TopRatedMovies = async (req, res) => {
    const page = req.query.page;

    if (page < 1) {
        throw new AppError("Invalid page number", 400);
    }

    const data = await tmdbService.fetchTopRatedMovies(page);

    res.status(200).json(data);
};

export const PopularMovies = async (req, res) => {
    const page = req.query.page;

    if (page < 1) {
        throw new AppError("Invalid page number", 400);
    }

    const data = await tmdbService.fetchPopularMovies(page);

    res.status(200).json(data);
};

export const UpcomingMovies = async (req, res) => {
    const page = req.query.page || 1;

    if (page < 1) {
        throw new AppError("Invalid page number", 400);
    }

    const data = await tmdbService.fetchUpcomingMovies(page);

    res.status(200).json(data);
};

export const SearchMovies = async (req, res) => {
    const search = req.query.query?.trim();

    if (!search) {
        throw new AppError("Search query is required", 400);
    }

    const data = await tmdbService.fetchSearchMovies(search);

    res.status(200).json(data);
};

export const MovieDetails = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        throw new AppError("Movie ID is required", 400);
    }

    const data = await tmdbService.fetchMovieDetails(id);

    res.status(200).json(data);
};

export const MovieCredits = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        throw new AppError("Movie ID is required", 400);
    }

    const data = await tmdbService.fetchMovieCredits(id);

    res.status(200).json(data);
};

export const MovieRecommendations = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        throw new AppError("Movie ID is required", 400);
    }

    const data = await tmdbService.fetchMovieRecommendations(id);

    res.status(200).json(data);
};

export const MovieReviews = async (req, res) => {
    const id = req.params.id;

    if (!id) {
        throw new AppError("Movie ID is required", 400);
    }

    const data = await tmdbService.fetchMovieReviews(id);

    res.status(200).json(data);
};