/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
// eslint-disable-next-line prettier/prettier
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prettier/prettier */
import api from "./client";

interface CompetitorPriceData {
  name: string;
  description: string;
  website: string;
}

export const getCompetitorPrices = async (
  data: CompetitorPriceData
) => {
  try {
    const response = await api.post(
      "/competitor-prices",
      data
    );

    console.log("Competitor Prices:", response.data);

    return response.data;
  } catch (error: any) {
    console.error(
      "Competitor Price Error:",
      error.response?.data
    );

    throw error;
  }
};