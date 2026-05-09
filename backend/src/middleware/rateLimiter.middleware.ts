import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again later.",
  },
});

export const apiRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  message: {
    status: "fail",
    message: "Rate limit exceeded. Slow down and retry.",
  },
});
