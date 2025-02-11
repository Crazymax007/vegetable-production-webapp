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

// 📌 เรียกดูข้อมูลOrderทั้งหมด
// export const getOrders = async () => {
//   try {
//     const response = await api.get("/orders");
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch orders:", error);
//     return [];
//   }
// };

// 📌 เรียกดูข้อมูลOrderด้วยการค้นหา && เรียกดูข้อมูลOrderทั้งหมด
export const getOrders = async (limit = 0) => {
  try {
    const response = await api.get("/orders?limit=${limit}");
    return response;
  } catch (error) {
    console.error("Failed to search orders:", error);
    return [];
  }
};
