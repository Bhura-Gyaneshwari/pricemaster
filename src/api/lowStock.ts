/* eslint-disable prettier/prettier */
import api from "./client";

export const getLowStock = async (
  userId: string
) => {
  try {
    const response = await api.get(
      "/low-stock",
      {
        params: {
          user_id: userId,
        },
      }
    );

    console.log(
      "Low Stock Success:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Low Stock Error:",
      error
    );

    throw error;
  }
};