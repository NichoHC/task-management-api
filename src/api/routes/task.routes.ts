import { Router } from "express";
import { getTasks, getTaskById, createTask, updateTask, deleteTask } from "../../controllers/tasks.controller";
import { validateBody } from "../middlewares/validator";
import { taskSchema } from "../../schemas/task.schema";
import { authMiddleware } from "../middlewares/validateToken";
const router = Router();

router.get("/tasks", authMiddleware, getTasks);
router.get("/tasks/:id", authMiddleware, getTaskById);
router.post("/tasks", authMiddleware, validateBody(taskSchema), createTask);
router.put("/tasks/:id", authMiddleware, validateBody(taskSchema), updateTask);
router.delete("/tasks/:id", authMiddleware, deleteTask);

export default router;