import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import "./login.css";
import logoLogin from "../../assets/images/test1.webp";
import { TextField, Typography } from "@mui/material";

const Login = () => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const data = await login(username, password); // เรียก API login

      // Redirect ตาม Role
      if (data.user.role === "admin") {
        navigate("/map");
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
    <div className="bg-login min-h-screen flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-6xl h-auto md:h-4/5 rounded-[36px] flex flex-col md:flex-row shadow-lg">
        {/* Left section */}
        <div className="flex-1 flex justify-center items-center p-6 md:p-8">
          <div className="flex flex-col items-center w-full">
            <h2 className="text-lg md:text-2xl text-center mb-4 md:mb-8 px-4">
              ระบบทำนายผลผลิต<br />ของกลุ่มวิสาหกิจชุมชนบ้านบางท่าข้าม
            </h2>
            {/* Form */}
            <form
              className="flex flex-col items-center w-full max-w-[450px] px-4"
              onSubmit={handleSubmit}
            >
              <TextField
                fullWidth
                label="ผู้ใช้"
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
                label="รหัสผ่าน"
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
        {/* Right section - Image */}
        <div className="flex-1 hidden md:flex justify-center items-center">
          <img
            src={logoLogin}
            alt="Login"
            className="w-full h-full rounded-none md:rounded-tr-[36px] md:rounded-br-[36px] object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
