import React, { useState } from "react";
import API from "./api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await API.post("/auth/register", { username: name, email, password });
      alert("Registered! Now login.");
      navigate("/"); 
    } catch (err) {
      alert(err.response?.data?.msg || "Error registering");
    }
  };

  return (
    <div className="container">
        <h2>Create Account 🚀</h2>

        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <button onClick={handleRegister}>Register</button>
        <p style={{ marginTop: "10px" }}>
          Already have an account? <a href="/">Login here</a>
        </p>
    </div>
  );
}

export default Register;
