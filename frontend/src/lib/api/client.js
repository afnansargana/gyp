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
    const status = error.response?.status;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    // Session expired / unauthorized — clear client auth
    if (status === 401 && localStorage.getItem("authToken")) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("username");
      localStorage.removeItem("email");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("isMechanic");
      localStorage.removeItem("role");
      localStorage.removeItem("mechanicId");
      if (window.location.pathname !== "/login") {
        window.location.assign("/login");
      }
    }

    return Promise.reject({
      ...error,
      message,
      status,
      data: error.response?.data,
    });
  }
);

export default apiClient;
