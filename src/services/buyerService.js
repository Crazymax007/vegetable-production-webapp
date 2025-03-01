import api from "./api";

// เรียกดูผู้รับซื้อทั้งหมด
export const getBuyers = async () => {
  try {
    const response = await api.get("/admin/buyer");
    return response.data;
  } catch (error) {
    console.error("Failed to get buyers:", error);
    throw error;
  }
};

export const getBuyerById = async (id) => {
  try {
    const response = await api.get(`/admin/buyer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to get buyer by id:", error);
    throw error;
  }
};

export const createBuyer = async (buyerData) => {
  try {
    const response = await api.post("/admin/buyer", buyerData);
    return response.data;
  } catch (error) {
    console.error("Failed to create buyer:", error);
    throw error;
  }
};

export const updateBuyer = async (id, buyerData) => {
  try {
    const response = await api.put(`/admin/buyer/${id}`, buyerData);
    return response.data;
  } catch (error) {
    console.error("Failed to update buyer:", error);
    throw error;
  }
};  

export const deleteBuyer = async (id) => {
  try {
    const response = await api.delete(`/admin/buyer/${id}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete buyer:", error);
    throw error;
  }
};
