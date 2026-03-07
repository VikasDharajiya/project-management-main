import express from "express";
import {
  getTasks,
  getWorkspaceTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router({ mergeParams: true });

router.use(protect);

// If projectId exists in params → project tasks, otherwise workspace tasks
router.get("/", (req, res, next) => {
  if (req.params.projectId) return getTasks(req, res, next);
  return getWorkspaceTasks(req, res, next);
});

router.post("/", createTask);
router.patch("/reorder", reorderTasks);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask);

export default router;
