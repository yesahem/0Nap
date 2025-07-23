import { Router } from "express";
import { addUrl, getUrls, deleteUrl } from "../controllers/urlController";
import { validateAddUrl } from "../middlewares/validateRequest";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.post("/", authenticate, validateAddUrl, addUrl);
router.get("/", authenticate, getUrls);
router.delete("/:id", authenticate, deleteUrl);

export default router; 