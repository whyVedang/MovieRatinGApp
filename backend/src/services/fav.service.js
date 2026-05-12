import prisma from "../lib/prisma.js"
import { AppError } from "../utils/AppError.js"

export const addFavoriteService = async (userId, movieId) => {
  const parsedMovieId = parseInt(movieId, 10);

  const check = await prisma.favorite.findFirst({
    where: { movieId: parsedMovieId, userId },
  });

  if (check) throw new AppError("Already in favorites", 400);

  return await prisma.favorite.create({
    data: { movieId: parsedMovieId, userId },
  });
};

export const getFavoriteService = async (userId,cursor,limit) => {
    const favorites = await prisma.favorite.findMany({
    where: { userId },
    take: limit + 1,
    ...(cursor && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: { createdAt: "desc" },
    include: { user: { select: { username: true } } },
  });

  let nextCursor = null;
  if (favorites.length > limit) {
    const nextItem = favorites.pop();
    nextCursor = nextItem.id;
  }
  
    return { favorites, nextCursor };
};

export const removeFavoriteService = async (userId,movieId) => {
  const parsemovieId = parseInt(movieId, 10);
  try {
    await prisma.favorite.delete({
      where: {
        userId_movieId: { userId,movieId:parsemovieId},
      },
    });

    res.status(200).json({ message: "Favorite removed" });
  } catch (error) {
    if (error.code === "P2025") {
      throw new AppError("Favorite not found", 404);
    }
    throw error;
  }
};