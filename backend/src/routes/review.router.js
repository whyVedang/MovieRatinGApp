import express from 'express';
import { writeReview,deleteReview, getMovieReviews, getUserAllReviews, getUserReview } from '../controller/review.controller.js';
import { tokenVerify } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { reviewSchema } from '../utils/schema.validator.js';

const router = express.Router({ mergeParams: true });

router.get('/', getMovieReviews);
router.post('/', tokenVerify ,validate(reviewSchema), writeReview);

router.delete('/:reviewId', tokenVerify , deleteReview);

router.get('/me', tokenVerify, getUserReview);

router.get('/user', tokenVerify, getUserAllReviews);

export default router;