import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/authService";
import "./login.css";
import logoLogin from "../../assets/images/test1.webp";
import { TextField } from "@mui/material";
import { useSnackbar } from 'notistack';

const Login = () => {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  // Remove this line
  // const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!username || !password) {
      enqueueSnackbar('กรุณากรอก ชื่อผู้ใช้ และ รหัสผ่าน', {
        variant: 'warning',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      });
      return false;
    }

    try {
      const data = await login(username, password);
      
      if (data?.user?.role === "admin" || ["manager", "farmer"].includes(data?.user?.role)) {
        navigate("/map", { replace: true });
      } else {
        enqueueSnackbar('ไม่มีสิทธิ์ในการเข้าถึง', {
          variant: 'error',
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'left',
          },
        });
      }
    } catch (err) {
      console.error(err);
      enqueueSnackbar('ชื่อผู้ใช้ หรือ รหัสผ่าน ไม่ถูกต้อง', {
        variant: 'error',
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'left',
        },
      });
      return false;
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
              noValidate
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
              <button
                type="button"
                className="login-button mt-4"
                onClick={handleSubmit}
              >
                เข้าสู่ระบบ
              </button>
              {/* Remove these lines since we're using Notistack now */}
              {/* {error && (
                <Typography color="error" variant="body2" sx={{ marginTop: 1 }}>
                  {error}
                </Typography>
              )} */}
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
