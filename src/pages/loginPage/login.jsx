import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import "./login.css";
import logoLogin from "../../assets/images/test1.webp";
import { TextField, Typography } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("manager");
  const [password, setPassword] = useState("manager");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(username, password); // เรียก API login

      // Redirect ตาม Role
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (["manager", "farmer"].includes(data.user.role)) {
        navigate("/map");
      } else {
        throw new Error("Invalid role");
      }
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="bg-login">
      <div className="bg-white w-4/5 h-4/5 rounded-[36px] flex">
        {/* ส่วนข้อความ (ซ้าย) */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              เข้าสู่ระบบ
            </Typography>
            {/* ฟอร์ม */}
            <form
              className="flex flex-col items-center w-[450px] max-w-[450px]"
              onSubmit={handleSubmit}
            >
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                sx={{
                  borderRadius: "40px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "40px",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  borderRadius: "40px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "40px",
                  },
                }}
              />
              <button type="submit" className="login-button mt-4">
                เข้าสู่ระบบ
              </button>
              {error && (
                <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                  {error}
                </Typography>
              )}
            </form>
          </div>
        </div>
        {/* ส่วนรูปภาพ (ขวา) */}
        <div className="flex-1 flex justify-center items-center">
          <img
            src={logoLogin}
            alt="Login"
            className="w-full rounded-tr-[36px] rounded-br-[36px] h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
