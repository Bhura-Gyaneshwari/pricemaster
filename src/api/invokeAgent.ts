/* eslint-disable prettier/prettier */

const BASE_URL =
  "https://d2zvwds63n1z3w.cloudfront.net";

export async function invokeAgent(
  userId: string,
  productName: string
) {
  const response = await fetch(
    `${BASE_URL}/invoke-agent?product_name=${encodeURIComponent(
      productName
    )}&user_id=${userId}`
  );

  if (!response.ok) {
    throw new Error(
      "Failed to invoke AI agent"
    );
  }

  return response.json();
}