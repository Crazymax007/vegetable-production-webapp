import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import "./login.css";
import logoLogin from "../../assets/images/test1.webp";
import { TextField, Typography } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State สำหรับจดจำรหัสผ่าน
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(username, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.data.role);

      // ถ้าติ๊ก "จดจำรหัสผ่าน" จะเก็บ username ไว้ใน localStorage
      if (rememberMe) {
        localStorage.setItem("rememberedUsername", username);
      } else {
        localStorage.removeItem("rememberedUsername");
      }

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
    }
  };

  return (
    <div className="bg-login">
      <div className="bg-white w-[1306px] h-[600px] rounded-[36px] flex">
        {/* ส่วนข้อความ (ซ้าย) */}
        <div className="flex-1 flex justify-center items-center">
          <div className="flex flex-col items-center">
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
              className=""
            >
              เข้าสู่ระบบ
            </Typography>
            {/* ฟอร์ม */}
            <form
              className="flex flex-col items-center w-[450px] max-w-[450px]"
              onSubmit={handleSubmit}
            >
              <TextField
                fullWidth
                className="bg-[#D7E5BE]"
                label="Username"
                variant="outlined"
                margin="normal"
                value={username}
                sx={{
                  borderRadius: "40px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "40px",
                    border: "none", // ลบ border
                  },
                }}
                onChange={(e) => setUsername(e.target.value)}
              />

              <TextField
                fullWidth
                className="bg-[#D7E5BE]"
                label="Password"
                type="password"
                variant="outlined"
                margin="normal"
                value={password}
                sx={{
                  borderRadius: "40px",
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "40px",
                  },
                }}
                onChange={(e) => setPassword(e.target.value)}
              />

              {/* จดจำรหัสผ่าน */}
              <div className="flex items-center w-full mt-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="mr-2 ml-4 w-4 h-4"
                />
                <label htmlFor="rememberMe" className="text-gray-600">
                  จดจำรหัสผ่าน
                </label>
              </div>

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
