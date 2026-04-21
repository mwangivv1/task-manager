import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  // ... rest of state

  // Simplified fetch using your api.js interceptor
  const fetchTasks = async () => {
    const res = await API.get("/tasks"); 
    setTasks(res.data);
  };

  // ... rest of code

  return (
    // ...
    <p onClick={() => navigate(`/task/${task._id}`)} style={{ cursor: "pointer" }}>
      {task.title}
    </p>
  );
}
