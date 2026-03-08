import { useState } from "react";
import { XIcon } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { createProjectThunk } from "../features/workspaceSlice";
import toast from "react-hot-toast";

const CreateProjectDialog = ({ isDialogOpen, setIsDialogOpen }) => {
  const dispatch = useDispatch();
  const currentWorkspace = useSelector(
    (state) => state.workspace?.currentWorkspace,
  );

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "ACTIVE",
    priority: "MEDIUM",
    end_date: "",
    emoji: "📁",
    color: "#6366f1",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const workspaceId = currentWorkspace?._id || currentWorkspace?.id;
    if (!workspaceId) {
      toast.error("No workspace selected");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(
        createProjectThunk({
          workspaceId,
          projectData: {
            name: formData.name,
            description: formData.description,
            status: formData.status,
            priority: formData.priority,
            emoji: formData.emoji,
            color: formData.color,
            dueDate: formData.end_date || undefined,
          },
        }),
      ).unwrap();

      toast.success("Project created successfully!");
      setIsDialogOpen(false);
      setFormData({
        name: "",
        description: "",
        status: "ACTIVE",
        priority: "MEDIUM",
        end_date: "",
        emoji: "📁",
        color: "#6366f1",
      });
    } catch (err) {
      toast.error(err || "Failed to create project");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg text-zinc-900 dark:text-zinc-200 relative">
        <button
          className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          onClick={() => setIsDialogOpen(false)}
        >
          <XIcon className="size-5" />
        </button>

        <h2 className="text-xl font-medium mb-1">Create New Project</h2>
        {currentWorkspace && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            In workspace:{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {currentWorkspace.name}
            </span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <div>
              <label className="block text-sm mb-1">Icon</label>
              <input
                type="text"
                value={formData.emoji}
                onChange={(e) =>
                  setFormData({ ...formData, emoji: e.target.value })
                }
                className="w-16 px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-center text-lg"
                maxLength={2}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm mb-1">Project Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter project name"
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe your project"
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              >
                <option value="ACTIVE">Active</option>
                <option value="PLANNING">Planning</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Color</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) =>
                  setFormData({ ...formData, color: e.target.value })
                }
                className="w-full h-[38px] mt-1 rounded border border-zinc-300 dark:border-zinc-700 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Due Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 text-sm">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectDialog;
