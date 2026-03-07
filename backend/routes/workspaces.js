import express from "express";
import {
  getWorkspaces,
  createWorkspace,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  removeMember,
  getAnalytics,
} from "../controllers/workspaceController.js";
import { protect } from "../middleware/auth.js";

// Nested project & task routes
import projectRouter from "./projects.js";
import taskRouter from "./tasks.js";

const router = express.Router();

// All workspace routes require auth
router.use(protect);

router.get("/", getWorkspaces);
router.post("/", createWorkspace);
router.get("/:workspaceId", getWorkspace);
router.put("/:workspaceId", updateWorkspace);
router.delete("/:workspaceId", deleteWorkspace);

// Members
router.post("/:workspaceId/invite", inviteMember);
router.delete("/:workspaceId/members/:userId", removeMember);

// Analytics
router.get("/:workspaceId/analytics", getAnalytics);

// Nested: /api/workspaces/:workspaceId/projects
router.use("/:workspaceId/projects", projectRouter);

// Nested: /api/workspaces/:workspaceId/tasks (all tasks in workspace)
router.use("/:workspaceId/tasks", taskRouter);

export default router;
