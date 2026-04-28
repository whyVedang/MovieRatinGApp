import express from "express";

import {
  getFavorite,
  addFavorite,
  removeFavorite,
} from "../controller/fav.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { favSchema } from "../utils/schema.validator.js";
import { apiLimiter } from "../utils/rateLimiter.js";

const router = express.Router();

router.post("/", protect, validate(favSchema), apiLimiter, addFavorite);
router.get("/", protect, getFavorite);
router.delete("/:movieId", protect, apiLimiter, removeFavorite);

export default router;
