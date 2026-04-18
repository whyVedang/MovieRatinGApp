import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/err.middleware.js";

import authRouter from "./routes/auth.router.js";
import favRouter from "./routes/favorite.router.js";
import movieRouter from "./routes/movie.router.js";

import client from "./redis/redis.js"
import {getUserAllReviews} from "./controller/review.controller.js"
import { tokenVerify } from "./middleware/auth.middleware.js";

if (!process.env.JWT_SECRET || !process.env.TMDB_APIKEY) {
    console.error("FATAL ERROR: JWT_SECRET or TMDB API is not defined in .env");
    process.exit(1); // Kill server 
}
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use("/api/v1/auth", authRouter);
app.use("/api/v1/favorite", favRouter);
app.use("/api/v1/movies", movieRouter);
app.use('/api/v1/reviews/me', tokenVerify, getUserAllReviews);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "MovieMate API is running"
  });
});
app.use(errorHandler);

export default app;