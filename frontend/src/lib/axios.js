import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:  "http://localhost:8888/api/",
  withCredentials: true,
});