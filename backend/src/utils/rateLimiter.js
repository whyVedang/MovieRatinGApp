import rateLimit from "express-rate-limit";

export const authRatelimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3,
  message: { message: "Too Many Attempts . Try Later" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const apiLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
