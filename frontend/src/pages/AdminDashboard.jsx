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

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

  const createTask = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim()) {
      setError("Title and description are required");
      return;
    }

    try {
      await API.post("/tasks", { title: title.trim(), description: description.trim() });
      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (err) {
      setError("Failed to create task");
    }
  };

  const deleteTask = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (!confirmed) return;

    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      setError("Failed to delete task");
    }
  };

  const badgeClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s.includes("progress")) return "badge badgeInProgress";
    if (s.includes("complete")) return "badge badgeCompleted";
    return "badge badgePending";
  };

  if (loading) return <p style={{ padding: 20 }}>Loading tasks...</p>;

  return (
    <div className="page" style={{ placeItems: "start center" }}>
      <div className="card" style={{ maxWidth: 900 }}>
        {/* Header */}
        <div className="headerRow">
          <div>
            <h2 className="title">Admin Dashboard</h2>
            <p className="subTitle">Create, review and manage all tasks</p>
          </div>
          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Error */}
        {error && <div className="alert">{error}</div>}

        {/* Create Task */}
        <hr className="divider" />
        <h3 style={{ margin: "0 0 10px" }}>Create Task</h3>

        <form className="form" onSubmit={createTask}>
          <div>
            <span className="label">Task Title</span>
            <input
              className="input"
              type="text"
              placeholder="e.g. Build login page UI"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <span className="label">Task Description</span>
            <textarea
              className="textarea"
              placeholder="Write task details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="actionsRow">
            <button className="btn btnPrimary" type="submit">
              Create Task
            </button>
          </div>
        </form>

        {/* Task List */}
        <hr className="divider" />
        <div className="headerRow" style={{ marginBottom: 0 }}>
          <h3 style={{ margin: 0 }}>All Tasks</h3>
          <span className="small">{tasks.length} total</span>
        </div>

        {tasks.length === 0 ? (
          <p className="small" style={{ marginTop: 10 }}>
            No tasks found
          </p>
        ) : (
          <div className="list">
            {tasks.map((task) => (
              <div key={task._id} className="taskCard">
                <div className="taskTop">
                  <div>
                    <h4 className="taskTitle">{task.title}</h4>
                    <p className="taskDesc">{task.description}</p>
                  </div>
                  <span className={badgeClass(task.status)}>
                    {task.status || "Pending"}
                  </span>
                </div>

                <div className="actionsRow">
                  <button
                    className="btn btnDanger"
                    onClick={() => deleteTask(task._id)}
                  >
                    Delete
                  </button>

                  {/* Optional: show created date if you have timestamps */}
                  {task.createdAt && (
                    <span className="small">
                      Created: {new Date(task.createdAt).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
