import Task from "../models/Task.js";
import Project from "../models/Project.js";

// GET /api/workspaces/:workspaceId/projects/:projectId/tasks
export const getTasks = async (req, res) => {
  try {
    const { status, priority, assignee } = req.query;

    const filter = {
      project: req.params.projectId,
      workspace: req.params.workspaceId,
    };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;

    const tasks = await Task.find(filter)
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar")
      .sort({ position: 1, createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/workspaces/:workspaceId/tasks
export const getWorkspaceTasks = async (req, res) => {
  try {
    const { status, priority, assignee } = req.query;

    const filter = { workspace: req.params.workspaceId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;

    const tasks = await Task.find(filter)
      .populate("assignee", "name email avatar")
      .populate("createdBy", "name email avatar")
      .populate("project", "name emoji color")
      .sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/workspaces/:workspaceId/projects/:projectId/tasks
export const createTask = async (req, res) => {
  try {
    const { title, description, assignee, priority, dueDate, status, type } =
      req.body;

    if (!title) return res.status(400).json({ message: "Title is required" });

    const project = await Project.findOne({
      _id: req.params.projectId,
      workspace: req.params.workspaceId,
    });
    if (!project) return res.status(404).json({ message: "Project not found" });

    const task = await Task.create({
      title,
      description,
      assignee: assignee || null,
      priority: priority || "MEDIUM",
      dueDate,
      status: status || "TODO",
      type: type || "TASK",
      project: req.params.projectId,
      workspace: req.params.workspaceId,
      createdBy: req.user._id,
    });

    await task.populate("assignee", "name email avatar");
    await task.populate("createdBy", "name email avatar");

    res.status(201).json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/workspaces/:workspaceId/projects/:projectId/tasks/:taskId
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      project: req.params.projectId,
      workspace: req.params.workspaceId,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    const {
      title,
      description,
      status,
      priority,
      assignee,
      dueDate,
      position,
      type,
    } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (type) task.type = type;
    if (assignee !== undefined) task.assignee = assignee || null;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (position !== undefined) task.position = position;

    await task.save();
    await task.populate("assignee", "name email avatar");
    await task.populate("createdBy", "name email avatar");

    res.json({ task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/workspaces/:workspaceId/projects/:projectId/tasks/:taskId
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      project: req.params.projectId,
      workspace: req.params.workspaceId,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/workspaces/:workspaces/:projectId/tasks/reorder
export const reorderTasks = async (req, res) => {
  try {
    const { tasks } = req.body;

    await Promise.all(
      tasks.map(({ _id, position }) =>
        Task.findByIdAndUpdate(_id, { position }),
      ),
    );

    res.json({ message: "Tasks reordered" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
