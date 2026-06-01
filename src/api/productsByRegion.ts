/* eslint-disable prettier/prettier */
import axios from "axios";

const API_BASE_URL =
  "https://d2zvwds63n1z3w.cloudfront.net";

export async function getProductsByRegion(
  userId: string,
  region: string
) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/products-by-region`,
      {
        params: {
          user_id: userId,
          region,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Products By Region Error:",
      error
    );

    throw error;
  }
}