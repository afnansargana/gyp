import apiClient from "./client";

export const authApi = {
  register: (payload) => apiClient.post("/users/register", payload),
  login: (payload) => apiClient.post("/users/login", payload),
  verifyOtp: (payload) => apiClient.post("/users/verify-otp", payload),
  resendOtp: (payload) => apiClient.post("/users/resend-otp", payload),
  refresh: () => apiClient.post("/users/refresh"),
  logout: () => apiClient.post("/users/logout"),
};

export default authApi;
