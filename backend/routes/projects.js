import express from "express";
import {
  getProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject,
  addProjectMember,
} from "../controllers/projectController.js";
import { protect } from "../middleware/auth.js";
import taskRouter from "./tasks.js";

const router = express.Router({ mergeParams: true });

router.use(protect);

router.get("/", getProjects);
router.post("/", createProject);
router.get("/:projectId", getProject);
router.put("/:projectId", updateProject);
router.delete("/:projectId", deleteProject);
router.post("/:projectId/members", addProjectMember);

// Nested tasks: /api/workspaces/:workspaceId/projects/:projectId/tasks
router.use("/:projectId/tasks", taskRouter);

export default router;
