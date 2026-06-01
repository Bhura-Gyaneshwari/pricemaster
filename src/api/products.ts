/* eslint-disable prettier/prettier */
import axios from "axios";

const API_BASE_URL = "https://d2zvwds63n1z3w.cloudfront.net";

export async function getProducts(userId: string) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products`,
      {
        params: {
          user_id: userId,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Products API Error:", error);
    throw error;
  }
}