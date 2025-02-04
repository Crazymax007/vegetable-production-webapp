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
export const getOrders = async ({
  search,
  season,
  farmerId,
  quantity,
  actualKg,
  status,
  orderDate,
}) => {
  try {
    const response = await api.get("/orders", {
      params: {
        search,
        season,
        farmerId,
        quantity,
        actualKg,
        status,
        orderDate,
      },
    });
    return response;
  } catch (error) {
    console.error("Failed to search orders:", error);
    return [];
  }
};
