import jwt from "jsonwebtoken"
import { AppError } from "../utils/AppError.js";
import { JWT_SECRET } from "../configenv.js";

export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Not authenticated", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded;

    next();
  } catch (err) {
    next(new AppError("Invalid or expired token", 401));
  }
};