import { Router } from "express";
import { register, login } from "../controllers/userController.js";
import { validateRegister, validateLogin } from "../middlewares/validateRequest.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

export default router; 