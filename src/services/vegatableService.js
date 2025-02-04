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
