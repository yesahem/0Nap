import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import urlRoutes from "./routes/urlRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { scheduleAll } from "./services/schedulerService.js";

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use("/api/users", userRoutes);
app.use("/api/urls", urlRoutes);

app.use(errorHandler);

scheduleAll();

export default app; 