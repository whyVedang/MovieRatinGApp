import express from 'express';

import {TopRatedMovies,PopularMovies,UpcomingMovies,SearchMovies,MovieDetails,MovieCredits,MovieRecommendations,MovieReviews} from "../controller/tmdb.controller.js"

const router = express.Router();

router.get('/popular', PopularMovies);
router.get('/top_rated', TopRatedMovies);
router.get('/upcoming', UpcomingMovies);
router.get('/:id', SearchMovies);

router.get("/search", SearchMovies);

router.get("/:id", MovieDetails);
router.get("/:id/credits", MovieCredits);
router.get("/:id/recommendations", MovieRecommendations);
router.get("/:id/reviews", MovieReviews);
export default router;