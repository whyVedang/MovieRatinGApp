import * as tmdbService from "../services/tmdb.js"

export const TopRatedMovies=async (req,res)=>{
    try{
        const page=req.query.page || 1
        if (page < 1) {
            return res.status(400).json({ message: "Invalid page number" });
        }
        const data = await tmdbService.fetchTopRatedMovies(page);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch popular movies" });
    }
}

export const PopularMovies=async (req,res)=>{
    try{
        const page=req.query.page || 1
        if (page < 1) {
            return res.status(400).json({ message: "Invalid page number" });
        }
        const data = await tmdbService.fetchPopularMovies(page);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch popular movies" });
    }
}

export const UpcomingMovies=async (req,res)=>{
    try{
        const page=req.query.page || 1
        if (page < 1) {
           return res.status(400).json({ message: "Invalid page number" });
        }
        const data = await tmdbService.fetchUpcomingMovies(page);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch popular movies" });
    }
}

export const SearchMovies=async (req,res)=>{
    try{
        const search=req.query.query?.trim()

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        const data = await tmdbService.fetchSearchMovies(search);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch popular movies" });
    }
}
export const MovieDetails=async (req,res)=>{
    try{
        const id=req.params.id || 1
        if (!id) {
           return res.status(400).json({ message: "Movie ID is required" });
        }
        const data = await tmdbService.fetchMovieDetails(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch popular movies" });
    }
}
export const MovieCredits=async (req,res)=>{
    try{
        const id=req.params.id || 1
        if (!id) {
           return res.status(400).json({ message: "Movie ID is required" });
        }
        const data = await tmdbService.fetchMovieCredits(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch popular movies" });
    }
}
export const MovieRecommendations=async (req,res)=>{
    try{
        const id=req.params.id || 1
        if (!id) {
           return res.status(400).json({ message: "Movie ID is required" });
        }
        const data = await tmdbService.fetchMovieRecommendations(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch popular movies" });
    }
}

export const MovieReviews=async (req,res)=>{
    try{
        const id=req.params.id || 1
        if (!id) {
           return res.status(400).json({ message: "Movie ID is required" });
        }
        const data = await tmdbService.fetchMovieReviews(id);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch Reviews" });
    }
}