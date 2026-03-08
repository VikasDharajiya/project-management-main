import Workspace from "../models/Workspace.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import mongoose from "mongoose";

// GET /api/workspaces
export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    }).populate("members.user", "name email avatar");

    // Attach projects to each workspace
    const workspacesWithProjects = await Promise.all(
      workspaces.map(async (ws) => {
        const projects = await Project.find({ workspace: ws._id });
        return { ...ws.toObject(), projects };
      }),
    );

    res.json({ workspaces: workspacesWithProjects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/workspaces
export const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
    });

    await workspace.populate("members.user", "name email avatar");
    res
      .status(201)
      .json({ workspace: { ...workspace.toObject(), projects: [] } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workspaces/:workspaceId
export const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId).populate(
      "members.user",
      "name email avatar",
    );

    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    const isMember = workspace.members.some(
      (m) => m.user._id.toString() === req.user._id.toString(),
    );
    if (!isMember) return res.status(403).json({ message: "Access denied" });

    const projects = await Project.find({ workspace: workspace._id });
    res.json({ workspace: { ...workspace.toObject(), projects } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/workspaces/:workspaceId
export const updateWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    if (workspace.owner.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Only owner can update workspace" });

    const { name, description, color } = req.body;
    if (name) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (color) workspace.color = color;

    await workspace.save();
    await workspace.populate("members.user", "name email avatar");

    const projects = await Project.find({ workspace: workspace._id });
    res.json({ workspace: { ...workspace.toObject(), projects } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/workspaces/:workspaceId
export const deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    if (workspace.owner.toString() !== req.user._id.toString())
      return res
        .status(403)
        .json({ message: "Only owner can delete workspace" });

    const projects = await Project.find({ workspace: workspace._id });
    const projectIds = projects.map((p) => p._id);
    await Task.deleteMany({ project: { $in: projectIds } });
    await Project.deleteMany({ workspace: workspace._id });
    await workspace.deleteOne();

    res.json({ message: "Workspace deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/workspaces/:workspaceId/invite
export const inviteMember = async (req, res) => {
  try {
    const { email, role = "member" } = req.body;
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    const inviter = workspace.members.find(
      (m) => m.user.toString() === req.user._id.toString(),
    );
    if (!inviter || inviter.role === "member")
      return res.status(403).json({ message: "No permission to invite" });

    const { default: User } = await import("../models/User.js");
    const userToInvite = await User.findOne({ email });
    if (!userToInvite)
      return res
        .status(404)
        .json({ message: "User with this email not found" });

    const alreadyMember = workspace.members.some(
      (m) => m.user.toString() === userToInvite._id.toString(),
    );
    if (alreadyMember)
      return res.status(400).json({ message: "User is already a member" });

    workspace.members.push({ user: userToInvite._id, role });
    await workspace.save();
    await workspace.populate("members.user", "name email avatar");

    res.json({ workspace });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/workspaces/:workspaceId/members/:userId
export const removeMember = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.workspaceId);
    if (!workspace)
      return res.status(404).json({ message: "Workspace not found" });

    if (workspace.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Only owner can remove members" });

    if (req.params.userId === workspace.owner.toString())
      return res.status(400).json({ message: "Cannot remove workspace owner" });

    workspace.members = workspace.members.filter(
      (m) => m.user.toString() !== req.params.userId,
    );
    await workspace.save();
    res.json({ message: "Member removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workspaces/:workspaceId/analytics
export const getAnalytics = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const wsObjectId = new mongoose.Types.ObjectId(workspaceId);

    const [
      totalProjects,
      totalTasks,
      completedTasks,
      tasksByStatus,
      tasksByPriority,
    ] = await Promise.all([
      Project.countDocuments({ workspace: workspaceId }),
      Task.countDocuments({ workspace: workspaceId }),
      Task.countDocuments({ workspace: workspaceId, status: "DONE" }),
      Task.aggregate([
        { $match: { workspace: wsObjectId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $match: { workspace: wsObjectId } },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      totalProjects,
      totalTasks,
      completedTasks,
      completionRate:
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
      tasksByStatus,
      tasksByPriority,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
