import api from "./api";

// Login User
export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data; // ส่ง { token, user: { id, username, role } } กลับ
};

// Logout User
export const logout = () => {
  localStorage.removeItem("token"); // ลบ Token จาก Local Storage
  localStorage.removeItem("role"); // ลบ Role (ถ้าเก็บไว้)
};
