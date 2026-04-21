import React, { useState } from "react";
import API from "./api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return alert("Please fill in all fields");
    
    setLoading(true);
    try {
      // Adjusted path to match your server.js '/api/auth' route
      const res = await API.post("/auth/login", { email, password });
      
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard"); // Fast redirect without page reload
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
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
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <p onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
        Don't have an account? Go to Register
      </p>
    </div>
  );
}

export default Login;