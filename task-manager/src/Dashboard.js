import React, { useEffect, useState } from "react";
import API from "./api";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    const res = await API.get("/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(res.data);
  };

  const createTask = async () => {
    await API.post(
      "/tasks",
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      <input
        placeholder="New Task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button onClick={createTask}>Add Task</button>

      <hr />

      {tasks.map((task) => (
        <div key={task._id}>
          <p
            onClick={() => (window.location.href = `/task/${task._id}`)}
            style={{ cursor: "pointer" }}
          >
            {task.title}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
