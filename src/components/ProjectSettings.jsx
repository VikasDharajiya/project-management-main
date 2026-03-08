import { format } from "date-fns";
import { Plus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { projectAPI } from "../services/api";
import AddProjectMember from "./AddProjectMember";
import toast from "react-hot-toast";

export default function ProjectSettings({ project }) {
  const { currentWorkspace } = useSelector((state) => state.workspace);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "PLANNING",
    priority: "MEDIUM",
    dueDate: "",
    progress: 0,
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        status: project.status || "PLANNING",
        priority: project.priority || "MEDIUM",
        dueDate: project.dueDate
          ? format(new Date(project.dueDate), "yyyy-MM-dd")
          : "",
        progress: project.progress || 0,
      });
    }
  }, [project]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const workspaceId = currentWorkspace?._id || currentWorkspace?.id;
    const projectId = project?._id || project?.id;
    if (!workspaceId || !projectId) return;

    setIsSubmitting(true);
    try {
      await projectAPI.update(workspaceId, projectId, formData);
      toast.success("Project updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full px-3 py-2 rounded mt-2 border text-sm dark:bg-zinc-900 border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-300";
  const cardClasses =
    "rounded-lg border p-6 bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border-zinc-300 dark:border-zinc-800";
  const labelClasses = "text-sm text-zinc-600 dark:text-zinc-400";

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      <div className={cardClasses}>
        <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">
          Project Details
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className={labelClasses}>Project Name</label>
            <input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={inputClasses}
              required
            />
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className={inputClasses + " h-24"}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className={labelClasses}>Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className={inputClasses}
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className={labelClasses}>Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className={inputClasses}
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className={inputClasses}
            />
          </div>
          <div className="space-y-2">
            <label className={labelClasses}>
              Progress: {formData.progress}%
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={formData.progress}
              onChange={(e) =>
                setFormData({ ...formData, progress: Number(e.target.value) })
              }
              className="w-full accent-blue-500 dark:accent-blue-400"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="ml-auto flex items-center text-sm justify-center gap-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white px-4 py-2 rounded"
          >
            <Save className="size-4" />{" "}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      <div className="space-y-6">
        <div className={cardClasses}>
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-zinc-300 mb-4">
              Team Members{" "}
              <span className="text-sm text-zinc-600 dark:text-zinc-400">
                ({project?.members?.length || 0})
              </span>
            </h2>
            <button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Plus className="size-4 text-zinc-900 dark:text-zinc-300" />
            </button>
            <AddProjectMember
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
            />
          </div>
          {project?.members?.length > 0 && (
            <div className="space-y-2 mt-2 max-h-48 overflow-y-auto">
              {project.members.map((member, index) => {
                const u = member?.user || member;
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between px-3 py-2 rounded dark:bg-zinc-800 text-sm text-zinc-900 dark:text-zinc-300"
                  >
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-zinc-300 dark:bg-zinc-600 flex items-center justify-center text-xs">
                        {u?.name?.[0] || u?.email?.[0] || "?"}
                      </div>
                      <span>{u?.name || u?.email || "Unknown"}</span>
                    </div>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 capitalize">
                      {member.role}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
