/* eslint-disable prettier/prettier */
import axios from "axios";

const API_BASE_URL =
  "https://d2zvwds63n1z3w.cloudfront.net";

export async function getGlueStatus(
  jobName: string
) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/glue/status/${jobName}`
    );

    return response.data;
  } catch (error) {
    console.error(
      "Glue Status Error:",
      error
    );

    throw error;
  }
}