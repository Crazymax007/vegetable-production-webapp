import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService"; // Path ตามตำแหน่งไฟล์ authService.js

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.data.role);

      // Redirect ตาม Role
      if (data.data.role === "admin") {
        navigate("/admin/dashboard");
      } else if (data.data.role === "manager") {
        navigate("/manager/dashboard");
      } else if (data.data.role === "farmer") {
        navigate("/user/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default Login;
