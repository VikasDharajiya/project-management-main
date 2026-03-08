import {
  SearchIcon,
  PanelLeft,
  XIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../features/themeSlice";
import { MoonIcon, SunIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = ({ setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme } = useSelector((state) => state.theme);
  const currentWorkspace = useSelector(
    (state) => state.workspace?.currentWorkspace,
  );

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const projects = currentWorkspace?.projects || [];
    const matched = [];

    projects.forEach((p) => {
      if (
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      ) {
        matched.push({
          type: "project",
          label: p.name,
          sub: p.status || "",
          url: `/projectsDetail?id=${p._id || p.id}&tab=tasks`,
          color: p.color || "#6366f1",
        });
      }
      (p.tasks || []).forEach((t) => {
        if (
          t.title?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
        ) {
          matched.push({
            type: "task",
            label: t.title,
            sub: p.name,
            url: `/taskDetails?projectId=${p._id || p.id}&taskId=${t._id || t.id}`,
            color: p.color || "#6366f1",
          });
        }
      });
    });
    setResults(matched.slice(0, 8));
  }, [query, currentWorkspace]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowResults(false);
      if (profileRef.current && !profileRef.current.contains(e.target))
        setShowProfile(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (url) => {
    navigate(url);
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("currentWorkspaceId");
    navigate("/login");
  };

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-6 xl:px-16 py-3 flex-shrink-0">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="sm:hidden p-2 rounded-lg transition-colors text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <PanelLeft size={20} />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-sm" ref={searchRef}>
            <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-zinc-400 size-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              onFocus={() => setShowResults(true)}
              placeholder="Search projects, tasks..."
              className="pl-8 pr-8 py-2 w-full bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
            />
            {query && (
              <button
                onClick={() => {
                  setQuery("");
                  setResults([]);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200"
              >
                <XIcon className="size-3.5" />
              </button>
            )}
            {showResults && query && (
              <div className="absolute top-full mt-1 left-0 w-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 overflow-hidden">
                {results.length > 0 ? (
                  results.map((r, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(r.url)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 text-left transition"
                    >
                      <div
                        className="size-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: r.color }}
                      />
                      <div className="min-w-0">
                        <p className="text-sm text-gray-900 dark:text-white truncate">
                          {r.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                          {r.type === "task"
                            ? `Task in ${r.sub}`
                            : `Project · ${r.sub}`}
                        </p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500 dark:text-zinc-400">
                    No results found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className="size-8 flex items-center justify-center bg-white dark:bg-zinc-800 shadow rounded-lg transition hover:scale-105 active:scale-95"
          >
            {theme === "light" ? (
              <MoonIcon className="size-4 text-gray-800" />
            ) : (
              <SunIcon className="size-4 text-yellow-400" />
            )}
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile((prev) => !prev)}
              className="size-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold hover:opacity-90 transition"
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-lg z-50 overflow-hidden">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-200 dark:border-zinc-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                    {user?.email || ""}
                  </p>
                </div>

                {/* Menu Items */}
                <div className="p-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md transition"
                  >
                    <UserIcon className="size-4" /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-md transition"
                  >
                    <SettingsIcon className="size-4" /> Settings
                  </Link>
                  <hr className="my-1 border-gray-200 dark:border-zinc-700" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-md transition"
                  >
                    <LogOutIcon className="size-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
