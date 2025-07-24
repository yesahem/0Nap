import { Router } from "express";
import { addUrl, getUrls, deleteUrl } from "../controllers/urlController.js";
import { validateAddUrl } from "../middlewares/validateRequest.js";
import { authenticate } from "../middlewares/auth.js";

const router = Router();

router.post("/", authenticate, validateAddUrl, addUrl);
router.get("/", authenticate, getUrls);
router.delete("/:id", authenticate, deleteUrl);

export default router; 