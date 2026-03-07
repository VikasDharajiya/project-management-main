// src/services/api.js
// Drop this file into your frontend src/services/ folder

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Helper ──────────────────────────────────────────────────────────────────

const getToken = () => localStorage.getItem("token");

const request = async (method, path, body = null) => {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${BASE_URL}${path}`, config);
  const data = await res.json();

  if (!res.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  patch: (path, body) => request("PATCH", path, body),
  delete: (path) => request("DELETE", path),
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/update-profile", data),
};

// ─── Workspaces ───────────────────────────────────────────────────────────────

export const workspaceAPI = {
  getAll: () => api.get("/workspaces"),
  getOne: (id) => api.get(`/workspaces/${id}`),
  create: (data) => api.post("/workspaces", data),
  update: (id, data) => api.put(`/workspaces/${id}`, data),
  delete: (id) => api.delete(`/workspaces/${id}`),
  inviteMember: (id, data) => api.post(`/workspaces/${id}/invite`, data),
  removeMember: (workspaceId, userId) =>
    api.delete(`/workspaces/${workspaceId}/members/${userId}`),
  getAnalytics: (id) => api.get(`/workspaces/${id}/analytics`),
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectAPI = {
  getAll: (workspaceId) => api.get(`/workspaces/${workspaceId}/projects`),
  getOne: (workspaceId, projectId) =>
    api.get(`/workspaces/${workspaceId}/projects/${projectId}`),
  create: (workspaceId, data) =>
    api.post(`/workspaces/${workspaceId}/projects`, data),
  update: (workspaceId, projectId, data) =>
    api.put(`/workspaces/${workspaceId}/projects/${projectId}`, data),
  delete: (workspaceId, projectId) =>
    api.delete(`/workspaces/${workspaceId}/projects/${projectId}`),
};

// ─── Tasks ────────────────────────────────────────────────────────────────────

export const taskAPI = {
  // All tasks in a project
  getByProject: (workspaceId, projectId, filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks${params ? "?" + params : ""}`
    );
  },
  // All tasks in workspace
  getByWorkspace: (workspaceId, filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(
      `/workspaces/${workspaceId}/tasks${params ? "?" + params : ""}`
    );
  },
  create: (workspaceId, projectId, data) =>
    api.post(`/workspaces/${workspaceId}/projects/${projectId}/tasks`, data),
  update: (workspaceId, projectId, taskId, data) =>
    api.put(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
      data
    ),
  delete: (workspaceId, projectId, taskId) =>
    api.delete(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    ),
  reorder: (workspaceId, projectId, tasks) =>
    api.patch(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/reorder`,
      { tasks }
    ),
};

export default api;
