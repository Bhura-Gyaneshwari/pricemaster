/* eslint-disable prettier/prettier */
import api from "./client";

export const getOverstock = async (
  userId: string
) => {
  try {
    const response = await api.get(
      "/overstock",
      {
        params: {
          user_id: userId,
        },
      }
    );

    console.log(
      "Overstock Success:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Overstock Error:",
      error
    );

    throw error;
  }
};