import axios from "axios";

const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost:3000/api";

export const apiClient = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
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

let refreshing = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const original = error.config || {};
    const url = original.url || "";

    if (
      status === 401 &&
      !original._retry &&
      !url.includes("/users/refresh") &&
      !url.includes("/users/login")
    ) {
      original._retry = true;
      try {
        if (!refreshing) {
          refreshing = apiClient.post("/users/refresh").finally(() => {
            refreshing = null;
          });
        }
        const { data } = await refreshing;
        if (data?.token) {
          localStorage.setItem("authToken", data.token);
        }
        return apiClient(original);
      } catch (refreshErr) {
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
        return Promise.reject(refreshErr);
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong";

    return Promise.reject({
      ...error,
      message,
      status,
      data: error.response?.data,
    });
  }
);

export default apiClient;
