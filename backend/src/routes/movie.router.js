import express from 'express';

import {TopRatedMovies,PopularMovies,UpcomingMovies,SearchMovies,MovieDetails,MovieCredits,MovieRecommendations} from "../controller/tmdb.controller.js"
import { cacheMovies } from '../middleware/redis.middleware.js';
import reviewRouter from './review.router.js'

const router = express.Router();



router.get('/popular',cacheMovies, PopularMovies);
router.get('/top_rated',cacheMovies, TopRatedMovies);
router.get('/upcoming',cacheMovies, UpcomingMovies);
router.get("/search", cacheMovies,SearchMovies);

router.get("/:id", MovieDetails);
router.get("/:id/credits", MovieCredits);
router.get("/:id/recommendations", MovieRecommendations);


router.use("/:id/reviews", reviewRouter)

export default router;