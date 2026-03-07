import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Workspace from "../models/Workspace.js";

// GET /api/workspaces/:workspaceId/projects
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      workspace: req.params.workspaceId,
    })
      .populate("createdBy", "name email avatar")
      .populate("taskCount")
      .sort({ createdAt: -1 });

    res.json({ projects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/workspaces/:workspaceId/projects
export const createProject = async (req, res) => {
  try {
    const { name, description, emoji, color, dueDate } = req.body;

    if (!name) return res.status(400).json({ message: "Name is required" });

    // Check workspace membership
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    const isMember = workspace.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );
    if (!isMember)
      return res.status(403).json({ message: "Not a workspace member" });

    const project = await Project.create({
      name,
      description,
      emoji,
      color,
      dueDate,
      workspace: req.params.workspaceId,
      createdBy: req.user._id,
    });

    await project.populate("createdBy", "name email avatar");

    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workspaces/:workspaceId/projects/:projectId
export const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      workspace: req.params.workspaceId,
    }).populate("createdBy", "name email avatar");

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/workspaces/:workspaceId/projects/:projectId
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      workspace: req.params.workspaceId,
    });

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    const { name, description, emoji, color, status, dueDate } = req.body;
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (emoji) project.emoji = emoji;
    if (color) project.color = color;
    if (status) project.status = status;
    if (dueDate !== undefined) project.dueDate = dueDate;

    await project.save();
    await project.populate("createdBy", "name email avatar");

    res.json({ project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/workspaces/:workspaceId/projects/:projectId
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      workspace: req.params.workspaceId,
    });

    if (!project)
      return res.status(404).json({ message: "Project not found" });

    // Delete all tasks in this project
    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
