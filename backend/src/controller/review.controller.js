import * as tmdbService from "../services/tmdb.js";
import prisma from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const writeReview = asyncHandler(async (req, res) => {
  const { movieId, rating, content } = req.body;
  const userId = req.user.userId;

  const review = await prisma.review.findFirst({
    where: { movieId, userId },
  });

  if (review) {
    throw new AppError("ALREADY REVIEWED", 400);
  }

  const newReview = await prisma.review.create({
    data: { movieId, rating, content, userId },
    include: {
      user: { select: { username: true } },
    },
  });

  res.status(201).json(newReview);
});

export const getUserAllReviews = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reviews = await prisma.review.findMany({
    where: { userId },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { username: true } } },
  });

  if (!reviews.length) {
    throw new AppError("No Review Yet", 404);
  }

  res.status(200).json(reviews);
});
export const getUserReview = asyncHandler(async (req, res) => {
  const movieId = parseInt(req.params.movieId);
  const userId = req.user.userId;

  const review = await prisma.review.findFirst({
    where: { movieId, userId },
  });

  res.status(200).json(review);
});

export const getMovieReviews = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    throw new AppError("Movie ID is required", 400);
  }

  const data = await tmdbService.fetchMovieReviews(id);
  res.status(200).json(data);
});

export const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.userId;

  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new AppError("Review not found", 404);
  }

  if (review.userId !== userId) {
    throw new AppError("You can only delete your own reviews", 403);
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  res.status(200).json({ message: "Review deleted successfully" });
});
