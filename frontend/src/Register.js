import React, { useState } from "react";
import API from "./api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return alert("All fields are required");
    }

    try {
      await API.post("/auth/register", { name, email, password });
      alert("Registered! Now login.");
      navigate("/"); // Redirect to login page
    } catch (err) {
      alert(err.response?.data?.msg || "Error registering");
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input 
        placeholder="Name" 
        onChange={(e) => setName(e.target.value)} 
      />
      <input 
        placeholder="Email" 
        onChange={(e) => setEmail(e.target.value)} 
        type="email"
      />
      <input 
        type="password" 
        placeholder="Password" 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleRegister}>Register</button>
      <p onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
        Already have an account? Login
      </p>
    </div>
  );
}

export default Register;
