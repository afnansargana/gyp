import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";
    return Promise.reject({
      ...error,
      message,
      status: error.response?.status,
      data: error.response?.data,
    });
  }
);

export default apiClient;
