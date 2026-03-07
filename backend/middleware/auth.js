import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid token" });
  }
};

// Check if user is a member of a workspace
export const workspaceMember = (requiredRole = "member") => {
  const roleHierarchy = { member: 1, admin: 2, owner: 3 };

  return async (req, res, next) => {
    try {
      const { Workspace } = await import("../models/Workspace.js");
      const workspaceId = req.params.workspaceId || req.body.workspace;

      const workspace = await Workspace.findById(workspaceId);
      if (!workspace) {
        return res.status(404).json({ message: "Workspace not found" });
      }

      const member = workspace.members.find(
        (m) => m.user.toString() === req.user._id.toString()
      );

      if (!member) {
        return res
          .status(403)
          .json({ message: "Not a member of this workspace" });
      }

      if (roleHierarchy[member.role] < roleHierarchy[requiredRole]) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      req.workspaceMemberRole = member.role;
      next();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
};
