import express from "express";
import {
  writeReview,
  deleteReview,
  getMovieReviews,
  getUserAllReviews,
  getUserReview,
} from "../controller/review.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { reviewSchema } from "../utils/schema.validator.js";
import { apiLimiter } from "../utils/rateLimiter.js";

const router = express.Router({ mergeParams: true });

router.get("/", getMovieReviews);
router.post("/", protect, validate(reviewSchema), apiLimiter, writeReview);

router.delete("/:reviewId", protect, apiLimiter, deleteReview);

export default router;
