import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/err.middleware.js";

import authRouter from "./routes/auth.router.js";
import favRouter from "./routes/favorite.router.js";
import reviewRouter from "./routes/review.router.js";
import movieRouter from "./routes/movie.router.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/favorite", favRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/movies", movieRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "MovieMate API is running"
  });
});
app.use(errorHandler);

export default app;