import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import urlRoutes from "./routes/urlRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { scheduleAll } from "./services/schedulerService.js";

const app = express();

app.use(cors({
  origin: ['https://0nap.shishuranjan.online'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));
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
app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.use(errorHandler);

scheduleAll();

export default app; 