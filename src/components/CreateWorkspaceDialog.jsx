import { useState } from "react";
import { XIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { createWorkspaceThunk } from "../features/workspaceSlice";
import toast from "react-hot-toast";

const CreateWorkspaceDialog = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await dispatch(
        createWorkspaceThunk({ name, description, color }),
      ).unwrap();
      toast.success("Workspace created!");
      setIsOpen(false);
      setName("");
      setDescription("");
    } catch (err) {
      toast.error(err || "Failed to create workspace");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200 relative">
        <button
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700"
          onClick={() => setIsOpen(false)}
        >
          <XIcon className="size-5" />
        </button>
        <h2 className="text-xl font-medium mb-4">Create Workspace</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Workspace Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Workspace"
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this workspace for?"
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-sm h-20"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Color</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-10 rounded border border-zinc-300 dark:border-zinc-700 cursor-pointer"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2 text-sm">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-60"
            >
              {isSubmitting ? "Creating..." : "Create Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateWorkspaceDialog;
