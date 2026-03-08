import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { workspaceAPI, projectAPI, taskAPI } from "../services/api";

export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const data = await workspaceAPI.getAll();
      return data.workspaces;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createWorkspaceThunk = createAsyncThunk(
  "workspace/create",
  async (workspaceData, { rejectWithValue }) => {
    try {
      const data = await workspaceAPI.create(workspaceData);
      return data.workspace;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createProjectThunk = createAsyncThunk(
  "workspace/createProject",
  async ({ workspaceId, projectData }, { rejectWithValue }) => {
    try {
      const data = await projectAPI.create(workspaceId, projectData);
      return data.project;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateProjectThunk = createAsyncThunk(
  "workspace/updateProject",
  async ({ workspaceId, projectId, projectData }, { rejectWithValue }) => {
    try {
      const data = await projectAPI.update(workspaceId, projectId, projectData);
      return data.project;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const createTaskThunk = createAsyncThunk(
  "workspace/createTask",
  async ({ workspaceId, projectId, taskData }, { rejectWithValue }) => {
    try {
      const data = await taskAPI.create(workspaceId, projectId, taskData);
      return { task: data.task, projectId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const updateTaskThunk = createAsyncThunk(
  "workspace/updateTask",
  async ({ workspaceId, projectId, taskId, taskData }, { rejectWithValue }) => {
    try {
      const data = await taskAPI.update(
        workspaceId,
        projectId,
        taskId,
        taskData,
      );
      return { task: data.task, projectId, progress: data.progress };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteTaskThunk = createAsyncThunk(
  "workspace/deleteTask",
  async ({ workspaceId, projectId, taskId }, { rejectWithValue }) => {
    try {
      await taskAPI.delete(workspaceId, projectId, taskId);
      return { taskId, projectId };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

export const deleteProjectThunk = createAsyncThunk(
  "workspace/deleteProject",
  async ({ workspaceId, projectId }, { rejectWithValue }) => {
    try {
      await projectAPI.delete(workspaceId, projectId);
      return projectId;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  },
);

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setCurrentWorkspace: (state, action) => {
      localStorage.setItem("currentWorkspaceId", action.payload);
      state.currentWorkspace =
        state.workspaces.find(
          (w) => w._id === action.payload || w.id === action.payload,
        ) || null;
    },
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },
    addWorkspace: (state, action) => {
      state.workspaces.push(action.payload);
      state.currentWorkspace = action.payload;
    },
    updateWorkspace: (state, action) => {
      state.workspaces = state.workspaces.map((w) =>
        w._id === action.payload._id ? action.payload : w,
      );
      if (state.currentWorkspace?._id === action.payload._id) {
        state.currentWorkspace = action.payload;
      }
    },
    deleteWorkspace: (state, action) => {
      state.workspaces = state.workspaces.filter(
        (w) => w._id !== action.payload,
      );
      if (state.currentWorkspace?._id === action.payload) {
        state.currentWorkspace = state.workspaces[0] || null;
      }
    },
    addProject: (state, action) => {
      if (state.currentWorkspace) {
        if (!state.currentWorkspace.projects)
          state.currentWorkspace.projects = [];
        state.currentWorkspace.projects.push(action.payload);
        state.workspaces = state.workspaces.map((w) =>
          w._id === state.currentWorkspace._id
            ? { ...w, projects: [...(w.projects || []), action.payload] }
            : w,
        );
      }
    },
    addTask: (state, action) => {
      if (!state.currentWorkspace) return;
      state.currentWorkspace.projects = (
        state.currentWorkspace.projects || []
      ).map((p) => {
        if (
          p._id === action.payload.projectId ||
          p.id === action.payload.projectId
        ) {
          return { ...p, tasks: [...(p.tasks || []), action.payload] };
        }
        return p;
      });
    },
    updateTask: (state, action) => {
      if (!state.currentWorkspace) return;
      state.currentWorkspace.projects = (
        state.currentWorkspace.projects || []
      ).map((p) => {
        if (
          p._id === action.payload.projectId ||
          p.id === action.payload.projectId
        ) {
          return {
            ...p,
            tasks: (p.tasks || []).map((t) =>
              t._id === action.payload._id || t.id === action.payload.id
                ? action.payload
                : t,
            ),
          };
        }
        return p;
      });
    },
    deleteTask: (state, action) => {
      if (!state.currentWorkspace) return;
      state.currentWorkspace.projects = (
        state.currentWorkspace.projects || []
      ).map((p) => ({
        ...p,
        tasks: (p.tasks || []).filter(
          (t) => !action.payload.includes(t._id || t.id),
        ),
      }));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.loading = false;
        state.workspaces = action.payload;
        const savedId = localStorage.getItem("currentWorkspaceId");
        const found = action.payload.find(
          (w) => w._id === savedId || w.id === savedId,
        );
        state.currentWorkspace = found || action.payload[0] || null;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder.addCase(createWorkspaceThunk.fulfilled, (state, action) => {
      state.workspaces.push(action.payload);
      state.currentWorkspace = action.payload;
    });

    builder.addCase(createProjectThunk.fulfilled, (state, action) => {
      if (state.currentWorkspace) {
        if (!state.currentWorkspace.projects)
          state.currentWorkspace.projects = [];
        state.currentWorkspace.projects.push(action.payload);
        state.workspaces = state.workspaces.map((w) =>
          w._id === state.currentWorkspace._id
            ? { ...w, projects: [...(w.projects || []), action.payload] }
            : w,
        );
      }
    });

    // Update project
    builder.addCase(updateProjectThunk.fulfilled, (state, action) => {
      if (state.currentWorkspace) {
        state.currentWorkspace.projects = (
          state.currentWorkspace.projects || []
        ).map((p) =>
          p._id === action.payload._id ? { ...p, ...action.payload } : p,
        );
        state.workspaces = state.workspaces.map((w) =>
          w._id === state.currentWorkspace._id
            ? { ...w, projects: state.currentWorkspace.projects }
            : w,
        );
      }
    });

    builder.addCase(createTaskThunk.fulfilled, (state, action) => {
      const { task, projectId } = action.payload;
      if (state.currentWorkspace) {
        state.currentWorkspace.projects = (
          state.currentWorkspace.projects || []
        ).map((p) =>
          p._id === projectId || p.id === projectId
            ? { ...p, tasks: [...(p.tasks || []), task] }
            : p,
        );
      }
    });

    builder.addCase(updateTaskThunk.fulfilled, (state, action) => {
      const { task, projectId, progress } = action.payload;
      if (state.currentWorkspace) {
        state.currentWorkspace.projects = (
          state.currentWorkspace.projects || []
        ).map((p) => {
          if (p._id === projectId || p.id === projectId) {
            const updatedTasks = (p.tasks || []).map((t) =>
              t._id === task._id ? task : t,
            );
            return {
              ...p,
              tasks: updatedTasks,
              progress: progress ?? p.progress,
            };
          }
          return p;
        });
      }
    });

    builder.addCase(deleteProjectThunk.fulfilled, (state, action) => {
      if (state.currentWorkspace) {
        state.currentWorkspace.projects = (
          state.currentWorkspace.projects || []
        ).filter((p) => p._id !== action.payload);
      }
    });
  },
});

export const {
  setWorkspaces,
  setCurrentWorkspace,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addProject,
  addTask,
  updateTask,
  deleteTask,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
