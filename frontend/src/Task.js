import React, { useEffect, useState, useCallback } from "react";
import API from "./api"; // This already handles your tokens!
import { useParams } from "react-router-dom";

function Task() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  // Wrapped in useCallback to prevent unnecessary re-renders
  const fetchTask = useCallback(async () => {
    try {
      // No need for manual headers; the interceptor does the work
      const res = await API.get(`/tasks/${id}`); 
      setTask(res.data);
    } catch (err) {
      setError("Could not load task details.");
      console.error(err);
    }
  }, [id]);

  const addComment = async () => {
    if (!comment.trim()) return; // Don't send empty comments

    try {
      await API.post(`/tasks/${id}/comments`, { text: comment });
      setComment("");
      fetchTask(); // Refresh the list
    } catch (err) {
      alert("Failed to add comment.");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!task) return <p>Loading...</p>;

  return (
    <div>
      <h2>{task.title}</h2>
      <p>{task.description}</p>

      <h3>Comments</h3>
      <div className="comments-list">
        {task.comments && task.comments.length > 0 ? (
          task.comments.map((c, i) => <p key={c._id || i}>{c.text}</p>)
        ) : (
          <p>No comments yet.</p>
        )}
      </div>

      <input
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={addComment}>Send</button>
    </div>
  );
}

export default Task;