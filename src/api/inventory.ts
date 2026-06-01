/* eslint-disable prettier/prettier */
import api from "./client";

export const getInventory = async (userId: string) => {
  try {
    const response = await api.get("/inventory", {
      params: {
        user_id: userId,
      },
    });

    console.log("Inventory Success:", response.data);

    return response.data;
  } catch (error) {
    console.error("Inventory Error:", error);

    throw error;
  }
};