import React, { useEffect, useState, useCallback } from "react";
import API from "./api"; 
import { useParams, useNavigate } from "react-router-dom";

function Task() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [comment, setComment] = useState(""); // Using this as the single source of truth for input
  const [error, setError] = useState(null);

  // FETCH: Get single task details
  const fetchTask = useCallback(async () => {
    try {
      const res = await API.get(`/tasks/${id}`); 
      setTask(res.data);
    } catch (err) {
      setError("Could not load task details.");
      console.error(err);
    }
  }, [id]);

  // CREATE: Post a new comment
  const addComment = async () => {
    if (!comment.trim()) return; 

    try {
      // Ensure this matches your backend route: router.post('/comment/:id', ...)
      const res = await API.post(`/tasks/comment/${id}`, { text: comment });
      
      // Update local state with the returned comments array
      setTask(prevTask => ({ ...prevTask, comments: res.data })); 
      setComment(""); // Clear input box
    } catch (err) {
      console.error("Failed to add comment", err);
      alert("Failed to add comment.");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  if (error) return (
    <div style={{ padding: "20px" }}>
      <p style={{ color: "red" }}>{error}</p>
      <button onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
    </div>
  );

  if (!task) return <p style={{ padding: "20px" }}>Loading task details...</p>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <button onClick={() => navigate("/dashboard")} style={{ marginBottom: "20px", cursor: "pointer" }}>
        ← Back to Dashboard
      </button>
      
      <div style={{ border: "1px solid #ddd", padding: "20px", borderRadius: "8px", background: "#fff" }}>
        <h2>{task.title}</h2>
        <p style={{ color: "#666", fontSize: "14px" }}>Status: <strong>{task.status}</strong></p>
        <p style={{ background: "#f9f9f9", padding: "15px", borderRadius: "4px", borderLeft: "4px solid #007bff" }}>
          {task.description || "No description provided."}
        </p>
      </div>

      <hr style={{ margin: "30px 0" }} />

      <h3>Updates & Comments</h3>
      <div className="comments-list" style={{ marginBottom: "20px" }}>
        {task.comments && task.comments.length > 0 ? (
          // We slice(0).reverse() to show newest comments at the top if desired
          task.comments.slice(0).reverse().map((c) => (
            <div key={c._id} style={{ 
              background: "#fff", 
              border: "1px solid #eee", 
              padding: "12px", 
              marginBottom: "10px", 
              borderRadius: "5px" 
            }}>
              <p style={{ margin: "0 0 5px 0" }}>{c.text}</p>
              <small style={{ color: "#999" }}>
                {new Date(c.createdAt).toLocaleString()}
              </small>
            </div>
          ))
        ) : (
          <p style={{ color: "#888" }}>No updates yet.</p>
        )}
      </div>

      {/* Input Section */}
      <div style={{ display: "flex", gap: "10px", background: "#fff", padding: "10px", borderRadius: "8px", border: "1px solid #ddd" }}>
        <input
          placeholder="Write a progress update..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={{ flex: 1, padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          onKeyPress={(e) => e.key === 'Enter' && addComment()} // Allow 'Enter' to send
        />
        <button 
          onClick={addComment} 
          style={{ 
            padding: "10px 20px", 
            backgroundColor: "#28a745", 
            color: "white", 
            border: "none", 
            borderRadius: "4px", 
            cursor: "pointer" 
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default Task;