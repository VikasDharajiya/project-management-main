import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setTheme } from "../features/themeSlice";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    theme: "light",
    notifications: true,
  });

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setSettings((prev) => ({ ...prev, theme: savedTheme }));
  }, []);

  const handleSave = () => {
    dispatch(setTheme(settings.theme));
    toast.success("Settings saved!");
  };

  const clearAppData = () => {
    const confirmed = window.confirm(
      "This will log you out and clear all local data. Continue?",
    );
    if (!confirmed) return;
    localStorage.clear();
    toast.success("App data cleared");
    setTimeout(() => navigate("/login"), 1000);
  };

  return (
    <div className="max-w-xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white mb-4 transition"
      >
        <ArrowLeftIcon className="size-4" /> Back
      </button>
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Settings
      </h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-6">
        {/* Theme */}
        <div>
          <label className="block text-sm mb-2 text-gray-700 dark:text-zinc-300">
            Theme
          </label>
          <select
            value={settings.theme}
            onChange={(e) =>
              setSettings({ ...settings, theme: e.target.value })
            }
            className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-200 p-2 rounded text-sm focus:outline-none focus:border-blue-500"
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
          </select>
        </div>

        {/* Notifications */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-700 dark:text-zinc-300">
            Enable Notifications
          </span>
          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={() =>
              setSettings({
                ...settings,
                notifications: !settings.notifications,
              })
            }
            className="accent-blue-500 w-4 h-4"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-5 py-2 rounded text-sm hover:opacity-90 transition"
        >
          Save Settings
        </button>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-red-500 mb-3">
            Danger Zone
          </h2>
          <button
            onClick={clearAppData}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
          >
            Clear All App Data & Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
