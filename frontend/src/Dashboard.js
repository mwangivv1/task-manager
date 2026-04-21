import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  // 1. READ: Get tasks from the server
  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching tasks", err);
    }
  };

  // 2. CREATE: Add a new task
  const createTask = async () => {
    if (!title) return;
    try {
      await API.post("/tasks", { title });
      setTitle("");
      fetchTasks(); // Refresh list after adding
    } catch (err) {
      alert("Error creating task");
    }
  };

  // 3. UPDATE: Toggle task status (e.g., pending -> completed)
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "pending" ? "completed" : "pending";
    try {
      const res = await API.put(`/tasks/${id}`, { status: newStatus });
      // Update local state so it reflects immediately
      setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // 4. DELETE: Remove task
  const deleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      setTasks(tasks.filter((t) => t._id !== id)); // Remove from local state
    } catch (err) {
      alert("Delete failed");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Tasks</h2>
      <div style={{ marginBottom: "20px" }}>
        <input 
          placeholder="What needs to be done?" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          style={{ padding: "8px", marginRight: "10px" }}
        />
        <button onClick={createTask}>Add Task</button>
      </div>

      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task._id} style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              borderBottom: "1px solid #eee", 
              padding: "10px 0" 
            }}>
              <div onClick={() => navigate(`/task/${task._id}`)} style={{ cursor: "pointer", flex: 1 }}>
                <span style={{ 
                  textDecoration: task.status === "completed" ? "line-through" : "none",
                  fontWeight: "bold"
                }}>
                  {task.title}
                </span>
                <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>Status: {task.status}</p>
              </div>

              <div>
                <button 
                  onClick={() => toggleStatus(task._id, task.status)}
                  style={{ marginRight: "10px", backgroundColor: "#e0e0e0" }}
                >
                  {task.status === "pending" ? "Done" : "Undo"}
                </button>
                <button 
                  onClick={() => deleteTask(task._id)}
                  style={{ backgroundColor: "#ff4d4d", color: "white", border: "none", padding: "5px 10px", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks yet. Create one above!</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;