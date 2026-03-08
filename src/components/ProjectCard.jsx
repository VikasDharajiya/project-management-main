import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { deleteProjectThunk } from "../features/workspaceSlice";
import toast from "react-hot-toast";

const statusColors = {
  PLANNING: "bg-gray-200 dark:bg-zinc-600 text-gray-900 dark:text-zinc-200",
  ACTIVE:
    "bg-emerald-200 dark:bg-emerald-500 text-emerald-900 dark:text-emerald-900",
  ON_HOLD: "bg-amber-200 dark:bg-amber-500 text-amber-900 dark:text-amber-900",
  COMPLETED: "bg-blue-200 dark:bg-blue-500 text-blue-900 dark:text-blue-900",
  CANCELLED: "bg-red-200 dark:bg-red-500 text-red-900 dark:text-red-900",
};

const ProjectCard = ({ project }) => {
  const dispatch = useDispatch();
  const currentWorkspace = useSelector(
    (state) => state.workspace?.currentWorkspace,
  );
  const projectId = project._id || project.id;

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      !window.confirm(
        `Delete "${project.name}"? This will also delete all tasks.`,
      )
    )
      return;
    const workspaceId = currentWorkspace?._id || currentWorkspace?.id;
    try {
      await dispatch(deleteProjectThunk({ workspaceId, projectId })).unwrap();
      toast.success("Project deleted!");
    } catch (err) {
      toast.error(err.message || "Failed to delete project");
    }
  };

  return (
    <div className="relative bg-white dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50 border border-gray-200 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700 rounded-lg p-5 transition-all duration-200 group">
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-3 right-3 p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all"
      >
        <Trash2 className="size-4" />
      </button>

      <Link
        to={`/projectsDetail?id=${projectId}&tab=tasks`}
        className="block pr-6"
      >
        <h3 className="font-semibold text-gray-900 dark:text-zinc-200 mb-1 truncate group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
          {project.name}
        </h3>
        <p className="text-gray-500 dark:text-zinc-400 text-sm line-clamp-2 mb-3">
          {project.description || "No description"}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span
            className={`px-2 py-0.5 rounded text-xs ${statusColors[project.status] || statusColors.PLANNING}`}
          >
            {project.status?.replace("_", " ") || "Planning"}
          </span>
          <span className="text-xs text-gray-500 dark:text-zinc-500 capitalize">
            {project.priority?.toLowerCase() || "medium"} priority
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 dark:text-zinc-500">Progress</span>
            <span className="text-gray-400 dark:text-zinc-400">
              {project.progress || 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-zinc-800 h-1.5 rounded">
            <div
              className="h-1.5 rounded bg-blue-500 transition-all"
              style={{ width: `${project.progress || 0}%` }}
            />
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProjectCard;
