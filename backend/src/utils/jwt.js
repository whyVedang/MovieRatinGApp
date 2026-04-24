import jwt from "jsonwebtoken";
import { JWTEXPIRESIN, JWT_SECRET } from "../configenv.js";
import crypto from "crypto";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWTEXPIRESIN },
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const generateRefreshToken = () => {
  return crypto.randomBytes(40).toString("hex");
};

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};