import prisma from "../lib/prisma.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addFavorite = asyncHandler(async (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.userId;
  const parsedMovieId = parseInt(movieId, 10);

  const check = await prisma.favorite.findFirst({
    where: { movieId: parsedMovieId, userId },
  });

  if (check) throw new AppError("Already in favorites", 400);

  const newFavorite = await prisma.favorite.create({
    data: {
      movieId: parsedMovieId,
      userId,
    },
  });

  res.status(201).json(newFavorite);
});

export const getFavorite = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const favorites = await prisma.favorite.findMany({
    where: { userId },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { username: true } } },
  });

  if (!favorites || favorites.length === 0) {
    throw new AppError("No Favorites Yet", 404);
  }

  res.status(200).json(favorites);
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const movieId = parseInt(req.params.movieId, 10);
  const userId = req.user.userId;

  try {
    await prisma.favorite.delete({
      where: {
        userId_movieId: { userId, movieId },
      },
    });

    res.status(200).json({ message: "Favorite removed" });
  } catch (error) {
    if (error.code === "P2025") {
      throw new AppError("Favorite not found", 404);
    }
    throw error;
  }
});
