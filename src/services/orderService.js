import api from "./api";

// 📌 เรียกดู top 3s
export const getTopVegetables = async (farmerId) => {
  try {
    const response = await api.get(`/top-vegetables/${farmerId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch top vegetables:", error);
    return [];
  }
};
