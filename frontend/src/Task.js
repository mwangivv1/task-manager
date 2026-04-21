import React, { useEffect, useState } from "react";
import API from "./api";
import { useParams } from "react-router-dom";

function Task() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [comment, setComment] = useState("");

  const token = localStorage.getItem("token");

  const fetchTask = async () => {
    const res = await API.get(`/tasks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTask(res.data);
  };

  const addComment = async () => {
    await API.post(
      `/tasks/${id}/comments`,
      { text: comment },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setComment("");
    fetchTask();
  };

  useEffect(() => {
    fetchTask();
  }, []);

  if (!task) return <p>Loading...</p>;

  return (
    <div>
      <h2>{task.title}</h2>

      <h3>Comments</h3>
      {task.comments?.map((c, i) => (
        <p key={i}>{c.text}</p>
      ))}

      <input
        placeholder="Write comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button onClick={addComment}>Send</button>
    </div>
  );
}

export default Task;
