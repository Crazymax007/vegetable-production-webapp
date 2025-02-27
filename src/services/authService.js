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

// เพิ่มผู้ใช้ใหม่
export const addUser = async (userData) => {
  const response = await api.post("/admin/user", userData);
  return response.data;
};

// ดึงข้อมูลผู้ใช้ทั้งหมด
export const getUsers = async () => {
  const response = await api.get("/admin/user");
  return response.data;
};

// ดึงข้อมูลผู้ใช้ตาม ID
export const getUserById = async (id) => {
  const response = await api.get(`/admin/user/${id}`);
  return response.data;
};

// อัพเดทข้อมูลผู้ใช้
export const updateUser = async (id, userData) => {
  const response = await api.put(`/admin/user/${id}`, userData);
  return response.data;
};

// ลบผู้ใช้
export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/user/${id}`);
  return response.data;
};
