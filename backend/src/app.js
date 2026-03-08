import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.routes.js";
import favoriteRouter from "./routes/favorite.routes.js";
import reviewRouter from "./routes/review.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/favorite", favoriteRouter);
app.use("/api/v1/review", reviewRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "active",
    message: "MovieMate API is running"
  });
});

export default app;