import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  // READ: Fetch tasks from MongoDB
  const fetchTasks = useCallback(async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  }, []);

  // CREATE: Add task to MongoDB
  const createTask = async () => {
    if (!title.trim()) return;
    try {
      await API.post("/tasks", { title, status: "pending" });
      setTitle("");
      fetchTasks(); // Refresh list
    } catch (err) {
      alert("Error creating task");
    }
  };

  // UPDATE: Cycle through enum statuses (pending -> in-progress -> completed)
  const updateStatus = async (id, currentStatus) => {
    const statusOrder = ["pending", "in-progress", "completed"];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];

    try {
      const res = await API.put(`/tasks/${id}`, { status: nextStatus });
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // DELETE: Remove task using MongoDB _id
  const deleteTask = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <div style={{ marginBottom: "20px" }}>
        <input 
          placeholder="New Task..." 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={createTask}>Add</button>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <div key={task._id} style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            padding: "10px", 
            borderBottom: "1px solid #ddd" 
          }}>
            <div onClick={() => navigate(`/task/${task._id}`)} style={{ cursor: "pointer" }}>
              <span style={{ 
                textDecoration: task.status === "completed" ? "line-through" : "none",
                fontWeight: "bold"
              }}>
                {task.title}
              </span>
              <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
                Status: {task.status.replace('-', ' ')}
              </p>
            </div>

            <div>
              <button onClick={() => updateStatus(task._id, task.status)}>Update Status</button>
              <button onClick={() => deleteTask(task._id)} style={{ marginLeft: "10px", color: "red" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="dashboard">
        <h2>📋 Your Tasks</h2>

        <input
          placeholder="New Task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={createTask}>Add</button>

        <hr />

        {tasks.map((task) => (
          <div
            key={task._id}
            className="task"
            onClick={() => (window.location.href = `/task/${task._id}`)}
          >
            {task.title}
          </div>
        ))}
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;