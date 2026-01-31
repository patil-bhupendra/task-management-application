import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { AuthContext } from "../auth/AuthContext";

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const fetchTasks = async () => {
    try {
      setError("");
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

  const updateStatus = async (id, status) => {
    try {
      setError("");
      await API.put(`/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      setError("Failed to update status");
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
            <h2 className="title">Employee Dashboard</h2>
            <p className="subTitle">View and update your assigned tasks</p>
          </div>

          <button className="btn" onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* Error */}
        {error && <div className="alert">{error}</div>}

        <hr className="divider" />

        {/* Task List */}
        <div className="headerRow" style={{ marginBottom: 0 }}>
          <h3 style={{ margin: 0 }}>My Tasks</h3>
          <span className="small">{tasks.length} total</span>
        </div>

        {tasks.length === 0 ? (
          <p className="small" style={{ marginTop: 10 }}>
            No tasks assigned
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
                  <div style={{ minWidth: 220 }}>
                    <span className="label">Update Status</span>
                    <select
                      className="select"
                      value={task.status || "Pending"}
                      onChange={(e) =>
                        updateStatus(task._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {task.updatedAt && (
                    <span className="small">
                      Updated:{" "}
                      {new Date(task.updatedAt).toLocaleString()}
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

export default EmployeeDashboard;
