/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import axios from "axios";
const api = axios.create({
  baseURL: "https://d2zvwds63n1z3w.cloudfront.net",
  headers: {
    "Content-Type": "application/json",
  },
});
export default api;
