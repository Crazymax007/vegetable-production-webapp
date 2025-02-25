import api from "./api";

// 🫛 เรียกดูผักทั้งหมด
export const getVegetables = async () => {
  try {
    const response = await api.get("/vegetables");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch vegetables:", error);
    return [];
  }
};

export const addVegetable = async (vegetableData) => {
  try {
    const response = await api.post("/vegetables", vegetableData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding vegetable:", error);
    throw error;
  }
};

// 🫛 ดึงข้อมูลผักตาม ID
export const getVegetableById = async (id) => {
  try {
    const response = await api.get(`/vegetables/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch vegetable:", error);
    throw error;
  }
};

// 🫛 อัพเดทข้อมูลผัก
export const updateVegetable = async (id, vegetableData) => {
  try {
    const response = await api.patch(`/vegetables/${id}`, vegetableData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating vegetable:", error);
    throw error;
  }
};

// 🫛 ลบข้อมูลผัก
export const deleteVegetable = async (id) => {
  try {
    const response = await api.delete(`/vegetables/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting vegetable:", error);
    throw error;
  }
};
