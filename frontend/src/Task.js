import React, { useEffect, useState, useCallback } from "react";
import API from "./api"; 
import { useParams, useNavigate } from "react-router-dom";

function Task() {
  const { id } = useParams();
  const navigate = useNavigate(); // Added for navigation
  const [task, setTask] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  const fetchTask = useCallback(async () => {
    try {
      const res = await API.get(`/tasks/${id}`); 
      setTask(res.data);
    } catch (err) {
      setError("Could not load task details.");
      console.error(err);
    }
  }, [id]);

  const addComment = async () => {
    if (!comment.trim()) return; 

    try {
      // Logic: Backend returns the updated comments array
      const res = await API.post(`/tasks/${id}/comments`, { text: comment });
      
      // Optimization: Update the local task object's comments with the new data
      setTask(prevTask => ({ ...prevTask, comments: res.data })); 
      setComment("");
    } catch (err) {
      alert("Failed to add comment.");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  if (error) return <div style={{ padding: "20px" }}><p style={{ color: "red" }}>{error}</p><button onClick={() => navigate("/dashboard")}>Back</button></div>;
  if (!task) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate("/dashboard")} style={{ marginBottom: "10px" }}>
        ← Back to Dashboard
      </button>
      
      <h2>{task.title}</h2>
      <p style={{ background: "#f4f4f4", padding: "10px", borderRadius: "4px" }}>
        {task.description || "No description provided."}
      </p>

      <hr />

      <h3>Comments</h3>
      <div className="comments-list" style={{ marginBottom: "20px" }}>
        {task.comments && task.comments.length > 0 ? (
          task.comments.map((c) => (
            <div key={c._id} style={{ borderBottom: "1px solid #eee", padding: "5px 0" }}>
              <p style={{ margin: 0 }}>{c.text}</p>
              <small style={{ color: "#999" }}>{new Date(c.createdAt).toLocaleString()}</small>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input
          placeholder="Write a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <button onClick={addComment} style={{ cursor: "pointer" }}>Send</button>
      </div>
    </div>
  );
}

export default Task;