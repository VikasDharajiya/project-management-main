import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { setTheme } from "../features/themeSlice";

const Settings = () => {

  const dispatch = useDispatch();

  const [settings, setSettings] = useState({
    theme: "light",
    notifications: true,
    sidebarCollapsed: false
  });

  useEffect(() => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setSettings((prev) => ({
        ...prev,
        theme: savedTheme
      }));
    }

  }, []);

  const handleThemeChange = (e) => {

    const value = e.target.value;

    setSettings({
      ...settings,
      theme: value
    });

  };

  const toggleNotifications = () => {

    setSettings({
      ...settings,
      notifications: !settings.notifications
    });

  };

  const toggleSidebar = () => {

    setSettings({
      ...settings,
      sidebarCollapsed: !settings.sidebarCollapsed
    });

  };

  const handleSave = () => {

  // Save theme in Redux + localStorage
  dispatch(setTheme(settings.theme));

  toast.success("Settings saved successfully");

};

  const clearAppData = () => {

    localStorage.clear();

    toast.success("All app data cleared");

    setTimeout(() => {
      window.location.reload();
    }, 1000);

  };

  return (

    <div className="max-w-xl mx-auto">

      <h1 className="text-2xl font-semibold mb-6">
        Settings
      </h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-6">

        {/* Theme */}
        <div>

          <label className="block text-sm mb-2">
            Theme
          </label>

          <select
            value={settings.theme}
            onChange={handleThemeChange}
            className="w-full border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 rounded"
          >

            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>

          </select>

        </div>

        {/* Notifications */}
        <div className="flex justify-between items-center">

          <span className="text-sm">
            Enable Notifications
          </span>

          <input
            type="checkbox"
            checked={settings.notifications}
            onChange={toggleNotifications}
          />

        </div>

        {/* Sidebar */}
        <div className="flex justify-between items-center">

          <span className="text-sm">
            Collapse Sidebar by Default
          </span>

          <input
            type="checkbox"
            checked={settings.sidebarCollapsed}
            onChange={toggleSidebar}
          />

        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded transition"
        >
          Save Settings
        </button>

        {/* Danger Zone */}
        <div className="pt-6 border-t border-gray-200 dark:border-zinc-800">

          <h2 className="text-sm font-semibold text-red-500 mb-2">
            Danger Zone
          </h2>

          <button
            onClick={clearAppData}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
          >
            Clear All App Data
          </button>

        </div>

      </div>

    </div>

  );
};

export default Settings;