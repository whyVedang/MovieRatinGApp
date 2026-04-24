import express from 'express';
import { writeReview,deleteReview, getMovieReviews, getUserAllReviews, getUserReview } from '../controller/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { reviewSchema } from '../utils/schema.validator.js';

const router = express.Router({ mergeParams: true });

router.get('/',getMovieReviews);
router.post('/', protect ,validate(reviewSchema), writeReview);

router.delete('/:reviewId', protect , deleteReview);

export default router;