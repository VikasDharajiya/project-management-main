# Project Management — MERN Backend

Complete Express + MongoDB backend for the GreatStackDev project management frontend.

---

## 📁 Folder Structure

```
backend/
├── config/
│   └── db.js               # MongoDB connection
├── controllers/
│   ├── authController.js   # Register, login, profile
│   ├── workspaceController.js
│   ├── projectController.js
│   └── taskController.js
├── middleware/
│   └── auth.js             # JWT protect + role check
├── models/
│   ├── User.js
│   ├── Workspace.js
│   ├── Project.js
│   └── Task.js
├── routes/
│   ├── auth.js
│   ├── workspaces.js
│   ├── projects.js
│   └── tasks.js
├── server.js               # Entry point
├── package.json
└── .env.example

frontend-files/             (drop into your React src/)
├── src/services/api.js     # All API calls
└── src/pages/Login.jsx     # Updated login (uses real API)
```

---

## 🚀 Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Create your .env
```bash
cp .env.example .env
```
Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/projectmanagement
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> **MongoDB Atlas (cloud):** Replace MONGO_URI with your Atlas connection string:
> `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/projectmanagement`

### 3. Run the server
```bash
npm run dev     # development (nodemon)
npm start       # production
```

---

## 🔌 Connect Frontend

### Step 1 — Add .env to your React project
Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

### Step 2 — Add the API service
Copy `api.js` → `src/services/api.js` in your frontend.

### Step 3 — Replace Login.jsx
Copy `Login.jsx` → `src/pages/Login.jsx` (or wherever your login page lives).

### Step 4 — Update auth checks in your app
Anywhere your code checks `localStorage.getItem("user")`, also check for the token:
```js
// Old
const user = localStorage.getItem("user");

// New — check token instead (or both)
const token = localStorage.getItem("token");
const user = localStorage.getItem("user");
```

### Step 5 — Update logout
```js
// In your logout handler
localStorage.removeItem("token");
localStorage.removeItem("user");
navigate("/login");
```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (🔒) |
| PUT | `/api/auth/update-profile` | Update profile (🔒) |

### Workspaces 🔒
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces` | All user workspaces |
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/workspaces/:id` | Get single workspace |
| PUT | `/api/workspaces/:id` | Update workspace |
| DELETE | `/api/workspaces/:id` | Delete workspace |
| POST | `/api/workspaces/:id/invite` | Invite member by email |
| DELETE | `/api/workspaces/:id/members/:userId` | Remove member |
| GET | `/api/workspaces/:id/analytics` | Get analytics |

### Projects 🔒
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces/:wid/projects` | All projects |
| POST | `/api/workspaces/:wid/projects` | Create project |
| GET | `/api/workspaces/:wid/projects/:pid` | Get project |
| PUT | `/api/workspaces/:wid/projects/:pid` | Update project |
| DELETE | `/api/workspaces/:wid/projects/:pid` | Delete project |

### Tasks 🔒
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workspaces/:wid/projects/:pid/tasks` | Tasks in project |
| GET | `/api/workspaces/:wid/tasks` | All workspace tasks |
| POST | `/api/workspaces/:wid/projects/:pid/tasks` | Create task |
| PUT | `/api/workspaces/:wid/projects/:pid/tasks/:tid` | Update task |
| DELETE | `/api/workspaces/:wid/projects/:pid/tasks/:tid` | Delete task |
| PATCH | `/api/workspaces/:wid/projects/:pid/tasks/reorder` | Reorder tasks |

🔒 = Requires `Authorization: Bearer <token>` header

---

## 🛠 Usage in React components

```jsx
import { workspaceAPI, projectAPI, taskAPI } from "../services/api";

// Fetch workspaces
const { workspaces } = await workspaceAPI.getAll();

// Create a project
const { project } = await projectAPI.create(workspaceId, {
  name: "My Project",
  emoji: "🚀",
  color: "#6366f1",
});

// Create a task
const { task } = await taskAPI.create(workspaceId, projectId, {
  title: "Fix login bug",
  priority: "high",
  status: "todo",
  assignedTo: userId,   // optional
  dueDate: "2025-12-31",
});

// Update task status (drag & drop)
await taskAPI.update(workspaceId, projectId, taskId, { status: "done" });
```
