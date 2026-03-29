import { Router } from "express";
import { register, login, logout } from "../../controllers/auth.controller";
import { userSchema } from "../../schemas/user.schema";
import { validateBody } from "../middlewares/validator";
const router = Router();

router.post("/register", validateBody(userSchema), register);
router.post("/login", login);
router.post("/logout", logout);

export default router;