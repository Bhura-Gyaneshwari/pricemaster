/* eslint-disable prettier/prettier */
import api from "./client";

export const testAPI = async () => {
  try {
    const response = await api.get("/");

    console.log("API Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
  }
};
