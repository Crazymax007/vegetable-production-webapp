import api from "./api";

// 📌 ดึงข้อมูลเกษตรกรทั้งหมด
export const getFarmers = async () => {
  try {
    const response = await api.get("/admin/farmer");
    return response.data; // ส่งคืนอาร์เรย์ของเกษตรกร
  } catch (error) {
    console.error("Error fetching farmers:", error);
    throw error;
  }
};

// 📌 เพิ่มเกษตรกรใหม่
export const addFarmer = async (farmerData) => {
  try {
    const response = await api.post("/admin/farmer", farmerData);
    return response.data; // ส่งคืนข้อมูลเกษตรกรที่เพิ่ม
  } catch (error) {
    console.error("Error adding farmer:", error);
    throw error;
  }
};

// 📌 ลบเกษตรกร
export const deleteFarmer = async (farmerId) => {
  try {
    await api.delete(`/admin/farmer/${farmerId}`);
  } catch (error) {
    console.error("Error deleting farmer:", error);
    throw error;
  }
};

// 📌 อัปเดตข้อมูลเกษตรกร
export const updateFarmer = async (farmerId, updatedData) => {
  try {
    const response = await api.put(`/admin/farmer/${farmerId}`, updatedData);
    return response.data; // ส่งคืนข้อมูลที่อัปเดตแล้ว
  } catch (error) {
    console.error("Error updating farmer:", error);
    throw error;
  }
};
