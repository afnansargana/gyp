import { create } from "zustand";

const readInitial = () => {
  const token = localStorage.getItem("authToken");
  return {
    token,
    isAuthenticated: !!token,
    userId: localStorage.getItem("userId") || null,
    username: localStorage.getItem("username") || null,
    email: localStorage.getItem("email") || null,
    isAdmin: JSON.parse(localStorage.getItem("isAdmin") || "false"),
    isMechanic: JSON.parse(localStorage.getItem("isMechanic") || "false"),
    pendingEmail: sessionStorage.getItem("pendingEmail") || null,
    pendingOtpDev: sessionStorage.getItem("pendingOtpDev") || null,
  };
};

export const useAuthStore = create((set) => ({
  ...readInitial(),

  setPendingVerification: ({ email, otp }) => {
    sessionStorage.setItem("pendingEmail", email);
    if (otp) {
      sessionStorage.setItem("pendingOtpDev", otp);
    } else {
      sessionStorage.removeItem("pendingOtpDev");
    }
    set({ pendingEmail: email, pendingOtpDev: otp || null });
  },

  clearPendingVerification: () => {
    sessionStorage.removeItem("pendingEmail");
    sessionStorage.removeItem("pendingOtpDev");
    set({ pendingEmail: null, pendingOtpDev: null });
  },

  setSession: (data) => {
    const {
      token,
      userId,
      username,
      email,
      isAdmin = false,
      isMechanic = false,
    } = data;

    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", userId || "");
    localStorage.setItem("username", username || "");
    localStorage.setItem("email", email || "");
    localStorage.setItem("isAdmin", JSON.stringify(!!isAdmin));
    localStorage.setItem("isMechanic", JSON.stringify(!!isMechanic));
    if (isMechanic && userId) {
      localStorage.setItem("mechanicId", userId);
    }

    sessionStorage.removeItem("pendingEmail");
    sessionStorage.removeItem("pendingOtpDev");

    set({
      token,
      isAuthenticated: true,
      userId,
      username,
      email,
      isAdmin: !!isAdmin,
      isMechanic: !!isMechanic,
      pendingEmail: null,
      pendingOtpDev: null,
    });
  },

  clearSession: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isMechanic");
    localStorage.removeItem("mechanicId");
    sessionStorage.removeItem("pendingEmail");
    sessionStorage.removeItem("pendingOtpDev");

    set({
      token: null,
      isAuthenticated: false,
      userId: null,
      username: null,
      email: null,
      isAdmin: false,
      isMechanic: false,
      pendingEmail: null,
      pendingOtpDev: null,
    });
  },
}));

export default useAuthStore;
