import express from 'express';
import { writeReview,getAllReviews,getReview,deleteReview } from '../controller/review.controller.js';
import { tokenVerify } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { reviewSchema } from '../utils/schema.validator.js';

const router = express.Router();

router.post('/', tokenVerify ,validate(reviewSchema), writeReview);
router.delete('/:reviewId', tokenVerify , deleteReview);
router.get('/:movieId',tokenVerify, getReview);
router.get('/',tokenVerify, getAllReviews);

export default router;