import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";

function WorkspaceDropdown() {
  const { workspaces } = useSelector((state) => state.workspace);
  const currentWorkspace = useSelector(
    (state) => state.workspace?.currentWorkspace || null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSelectWorkspace = (workspaceId) => {
    dispatch(setCurrentWorkspace(workspaceId));
    setIsOpen(false);
    navigate("/");
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => name?.slice(0, 2).toUpperCase() || "WS";

  return (
    <div className="relative m-4" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between p-3 h-auto text-left rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded shadow flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: currentWorkspace?.color || "#6366f1" }}
          >
            {getInitials(currentWorkspace?.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
              {currentWorkspace?.name || "Select Workspace"}
            </p>
            <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
              {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-500 dark:text-zinc-400 flex-shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded shadow-lg top-full left-0">
          <div className="p-2">
            <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-2">
              Workspaces
            </p>
            {workspaces.map((ws) => {
              const wsId = ws._id || ws.id;
              const currentId = currentWorkspace?._id || currentWorkspace?.id;
              return (
                <div
                  key={wsId}
                  onClick={() => onSelectWorkspace(wsId)}
                  className="flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
                >
                  <div
                    className="w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: ws.color || "#6366f1" }}
                  >
                    {getInitials(ws.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                      {ws.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-zinc-400">
                      {ws.members?.length || 0} members
                    </p>
                  </div>
                  {currentId === wsId && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          <hr className="border-gray-200 dark:border-zinc-700" />

          <div className="p-2">
            <button
              onClick={() => {
                setIsOpen(false);
                setIsCreateOpen(true);
              }}
              className="flex items-center text-xs gap-2 my-1 w-full text-blue-600 dark:text-blue-400 hover:text-blue-500 p-2 rounded hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              <Plus className="w-4 h-4" /> Create Workspace
            </button>
          </div>
        </div>
      )}

      <CreateWorkspaceDialog
        isOpen={isCreateOpen}
        setIsOpen={setIsCreateOpen}
      />
    </div>
  );
}

export default WorkspaceDropdown;
