import { useState, useEffect } from "react";
import { authAPI } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

const Profile = () => {
  const [user, setUser] = useState({ name: "", email: "", avatar: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser({
      name: storedUser.name || "",
      email: storedUser.email || "",
      avatar: storedUser.avatar || "",
    });
  }, []);

  const handleUpdateProfile = async () => {
    if (!user.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setIsSubmitting(true);
    try {
      const data = await authAPI.updateProfile({ name: user.name.trim() });
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        name: data.user?.name || user.name,
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser((prev) => ({ ...prev, name: updatedUser.name }));
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-gray-900 dark:text-zinc-200 w-full p-2 rounded text-sm focus:outline-none focus:border-blue-500";

  return (
    <div className="max-w-lg mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white mb-4 transition"
      >
        <ArrowLeftIcon className="size-4" /> Back
      </button>
      <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
        Profile
      </h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-200 dark:border-zinc-800 space-y-5">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {user.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-zinc-400">
              {user.email}
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-zinc-300">
            Name
          </label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser({ ...user, name: e.target.value })}
            className={inputClasses}
          />
        </div>

        <div>
          <label className="block text-sm mb-1 text-gray-700 dark:text-zinc-300">
            Email
          </label>
          <input
            type="email"
            value={user.email}
            disabled
            className={inputClasses + " opacity-60 cursor-not-allowed"}
          />
        </div>

        <button
          onClick={handleUpdateProfile}
          disabled={isSubmitting}
          className="bg-gradient-to-br from-blue-500 to-blue-600 text-white px-5 py-2 rounded text-sm hover:opacity-90 disabled:opacity-60 transition"
        >
          {isSubmitting ? "Saving..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
