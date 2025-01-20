import axios from "axios";

// สร้าง Axios Instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL ของ API
  timeout: 5000, // กำหนด Timeout (5 วินาที)
  headers: {
    "Content-Type": "application/json", // กำหนดว่า API ใช้ JSON
  },
});

// Interceptor สำหรับเพิ่ม Token ลงใน Headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // ดึง Token จาก Local Storage
    console.log("token:"+token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // เพิ่ม Authorization Header
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor สำหรับจัดการ Error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Please log in again.");
      // สามารถเพิ่ม Redirect หรือ Logout Logic ได้
      localStorage.removeItem("token"); // ลบ Token เมื่อไม่ได้รับอนุญาต
      window.location.href = "/login"; // Redirect ไปหน้า Login
    }
    return Promise.reject(error.response ? error.response.data : error.message);
  }
);

export default api;
