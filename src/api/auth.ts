/* eslint-disable prettier/prettier */
import api from "./client";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

export const signupUser = async (data: SignupData) => {
  try {
    const response = await api.post("/signup", data);

    console.log("Signup Success:", response.data);

    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Full Signup Error:", error.response?.data);

    throw error;
  }
};
interface SigninData {
  email: string;
  password: string;
}

export const signinUser = async (data: SigninData) => {
  try {
    const response = await api.post("/signin", data);

    console.log("Signin Success:", response.data);

    return response.data;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Full Signin Error:", error.response?.data);

    throw error;
  }
};
