import prisma from "../lib/prisma.js";
import * as Service from "../services/fav.service.js"
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const addFavorite = asyncHandler(async (req, res) => {
  const newFavorite = await Service.addFavoriteService(req.user.userId,req.body.movieId)
  res.status(201).json(newFavorite);
});

export const getFavorite = asyncHandler(async (req, res) => {
  
  const cursor=req.query.cursor || null;
  const limit = parseInt(req.query.limit) || 10;
  
  const favorites = await Service.getFavoriteService(req.user.userId,cursor,limit);
  res.status(200).json(favorites);
});

export const removeFavorite = asyncHandler(async (req, res) => {
  await Service.removeFavoriteService(req.user.userId,req.params.movieId)
  res.status(200).json({ message: "Favorite removed" });
});