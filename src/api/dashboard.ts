/* eslint-disable prettier/prettier */
import api from "./client";

export const getDashboard = async (
  userId: string
) => {
  try {
    const response = await api.get(
      "/api/dashboard",
      {
        params: {
          user_id: userId,
        },
      }
    );

    console.log(
      "Dashboard Success:",
      response.data
    );

    return response.data;
  } catch (error) {
    console.error(
      "Dashboard Error:",
      error
    );

    throw error;
  }
};