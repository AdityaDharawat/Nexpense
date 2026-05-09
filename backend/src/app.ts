import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config/config";
import routes from "./routes/index";
import { apiRateLimiter, authRateLimiter } from "./middleware/rateLimiter.middleware";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan(config.nodeEnv === "production" ? "combined" : "dev"));
app.use(apiRateLimiter);

app.get("/api/health", (_, res) => {
  res.status(200).json({ status: "success", message: "Expense Tracker API is healthy" });
});

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
