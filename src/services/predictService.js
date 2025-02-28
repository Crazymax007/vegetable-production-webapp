import api from "./api";

export const predictOrder = async (orderData) => {
  try {
    const response = await api.post("/predict", orderData);
    return response;
  } catch (error) {
    console.error("Failed to create order:", error);
  }
};

export const checkAvailableFarmers = async (orderData) => {
  try {
    const response = await api.post("/check-available-farmers", orderData);
    return response;
  } catch (error) {
    console.error("Failed to check available farmers:", error);
  }
};


