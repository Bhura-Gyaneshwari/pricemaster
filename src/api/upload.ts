/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import api from "./client";

export const uploadFile = async (
  userId: string,
  file: File
) => {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/upload-file?user_id=${encodeURIComponent(
      userId
    )}`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  console.log(
    "Upload Success:",
    response.data
  );

  return response.data;
};