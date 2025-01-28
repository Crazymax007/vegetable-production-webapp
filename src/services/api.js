import axios from "axios";

// สร้าง Axios Instance
const api = axios.create({
  baseURL: "http://localhost:5000/api", // Base URL ของ API
  timeout: 5000, // กำหนด Timeout (5 วินาที)
  headers: {
    "Content-Type": "application/json", // กำหนดว่า API ใช้ JSON
  },
  withCredentials: true, // ให้ส่ง Cookie ในทุกคำขอ
});

// Interceptor สำหรับจัดการ Error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized: Please log in again.");
      window.location.href = "/login"; 
    }
    return Promise.reject(error.response ? error.response.data : error.message);
  }
);

export default api;
