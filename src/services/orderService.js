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

// 📌 เรียกดูข้อมูลOrderด้วยการค้นหา && เรียกดูข้อมูลOrderทั้งหมด
export const getOrders = async ({
  limit = 0,
  search = "",
  season = "",
  farmerId = "",
  quantity = "",
  actualKg = "",
  status = "",
  orderDate = "",
} = {}) => {
  try {
    // สร้าง query string สำหรับการค้นหา
    const params = new URLSearchParams();

    if (limit) params.append("limit", limit);
    if (search) params.append("search", search);
    if (season) params.append("season", season);
    if (farmerId) params.append("farmerId", farmerId);
    if (quantity) params.append("quantity", quantity);
    if (actualKg) params.append("actualKg", actualKg);
    if (status) params.append("status", status);
    if (orderDate) params.append("orderDate", orderDate);

    // ส่ง request พร้อม query parameters
    const response = await api.get(`/orders?${params.toString()}`);

    return response;
  } catch (error) {
    console.error("Failed to search orders:", error);
    return [];
  }
};

// 📌  สร้างOrder
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders", orderData); 
    return response;
  } catch (error) {
    console.error("Failed to create order:", error);
  }
};

export const updateOrder = async (id, orderData) => {
  try {
    const response = await api.put(`/orders/${id}`, orderData);
    return response;
  } catch (error) {
    console.error("Failed to update order:", error);
  }
};

export const predictOrder = async (orderData) => {
  try {
    const response = await api.post("/predict", orderData);
    return response;
  } catch (error) {
    console.error("Failed to create order:", error);
  }
};


