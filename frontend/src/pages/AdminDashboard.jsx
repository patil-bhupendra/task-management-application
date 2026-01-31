import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle admin logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Fetch all tasks (Admin access)
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Create a new task
  const createTask = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description) {
      setError("Title and description are required");
      return;
    }

    try {
      await API.post("/tasks", { title, description });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      setError("Failed to create task");
    }
  };

  // Delete an existing task (Admin only)
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading tasks...</p>;

  return (
    <div style={{ padding: 30 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Admin Dashboard</h2>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Error */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Create Task */}
      <h3>Create Task</h3>
      <form onSubmit={createTask}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <br /><br />

        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <br /><br />

        <button type="submit">Create Task</button>
      </form>

      <hr />

      {/* Task List */}
      <h3>All Tasks</h3>

      {tasks.length === 0 && <p>No tasks found</p>}

      {tasks.map((task) => (
        <div
          key={task._id}
          style={{
            border: "1px solid #ccc",
            padding: 15,
            marginBottom: 10,
          }}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>

          <button onClick={() => deleteTask(task._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
