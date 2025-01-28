import api from "./api";

// Login User
export const login = async (username, password) => {
  const response = await api.post("/auth/login", { username, password });
  return response.data; // ส่ง { message, user }
};

// Logout User
export const logout = async () => {
  await api.post("/auth/logout");
};

// ดึงข้อมูลผู้ใช้
export const getUserInfo = async () => {
  const response = await api.get("/auth/me");
  return response.data; // ส่ง { id, username, role }
};
