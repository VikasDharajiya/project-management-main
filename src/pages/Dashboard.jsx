import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import StatsGrid from "../components/StatsGrid";
import ProjectOverview from "../components/ProjectOverview";
import RecentActivity from "../components/RecentActivity";
import TasksSummary from "../components/TasksSummary";
import CreateProjectDialog from "../components/CreateProjectDialog";
import CreateWorkspaceDialog from "../components/CreateWorkspaceDialog";
import { fetchWorkspaces } from "../features/workspaceSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { loading, workspaces } = useSelector((state) => state.workspace);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    dispatch(fetchWorkspaces());
  }, [dispatch]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
            Welcome back, {user?.name || "User"} 👋
          </h1>
          <p className="text-gray-500 dark:text-zinc-400 text-sm">
            Here's what's happening with your projects today
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWorkspaceDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-2 text-sm rounded border border-zinc-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            <Plus size={16} /> New Workspace
          </button>

          <button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-2 px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:opacity-90 transition"
          >
            <Plus size={16} /> New Project
          </button>
        </div>

        <CreateProjectDialog
          isDialogOpen={isDialogOpen}
          setIsDialogOpen={setIsDialogOpen}
        />
        <CreateWorkspaceDialog
          isOpen={isWorkspaceDialogOpen}
          setIsOpen={setIsWorkspaceDialogOpen}
        />
      </div>

      {/* No workspace yet */}
      {!loading && workspaces.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-5xl">🏢</div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            No workspace yet
          </h2>
          <p className="text-gray-500 dark:text-zinc-400 text-sm text-center max-w-sm">
            Create your first workspace to start managing projects and tasks.
          </p>
          <button
            onClick={() => setIsWorkspaceDialogOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:opacity-90 transition"
          >
            <Plus size={16} /> Create Workspace
          </button>
        </div>
      )}

      {/* Loading spinner */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Dashboard content */}
      {!loading && workspaces.length > 0 && (
        <>
          <StatsGrid />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProjectOverview />
              <RecentActivity />
            </div>
            <div>
              <TasksSummary />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
