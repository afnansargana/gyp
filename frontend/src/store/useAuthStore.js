import { create } from "zustand";

function deriveRole(isAdmin, isMechanic, role) {
  if (role === "admin" || role === "mechanic" || role === "customer") {
    return role;
  }
  if (isAdmin) return "admin";
  if (isMechanic) return "mechanic";
  return "customer";
}

const readInitial = () => {
  const token = localStorage.getItem("authToken");
  const isAdmin = JSON.parse(localStorage.getItem("isAdmin") || "false");
  const isMechanic = JSON.parse(localStorage.getItem("isMechanic") || "false");
  const storedRole = localStorage.getItem("role");
  const role = deriveRole(isAdmin, isMechanic, storedRole);

  return {
    token,
    isAuthenticated: !!token,
    userId: localStorage.getItem("userId") || null,
    username: localStorage.getItem("username") || null,
    email: localStorage.getItem("email") || null,
    isAdmin,
    isMechanic,
    role,
    pendingEmail: sessionStorage.getItem("pendingEmail") || null,
    pendingOtpDev: sessionStorage.getItem("pendingOtpDev") || null,
  };
};

export const useAuthStore = create((set, get) => ({
  ...readInitial(),

  homePathForRole: () => {
    const { role } = get();
    if (role === "admin") return "/admin/dashboard";
    if (role === "mechanic") return "/mechanic/dashboard";
    return "/";
  },

  hasRole: (...roles) => roles.includes(get().role),

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
      role: incomingRole,
    } = data;

    const role = deriveRole(!!isAdmin, !!isMechanic, incomingRole);

    localStorage.setItem("authToken", token);
    localStorage.setItem("userId", userId || "");
    localStorage.setItem("username", username || "");
    localStorage.setItem("email", email || "");
    localStorage.setItem("isAdmin", JSON.stringify(role === "admin"));
    localStorage.setItem("isMechanic", JSON.stringify(role === "mechanic"));
    localStorage.setItem("role", role);
    if (role === "mechanic" && userId) {
      localStorage.setItem("mechanicId", userId);
    } else {
      localStorage.removeItem("mechanicId");
    }

    sessionStorage.removeItem("pendingEmail");
    sessionStorage.removeItem("pendingOtpDev");

    set({
      token,
      isAuthenticated: true,
      userId,
      username,
      email,
      isAdmin: role === "admin",
      isMechanic: role === "mechanic",
      role,
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
    localStorage.removeItem("role");
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
      role: "customer",
      pendingEmail: null,
      pendingOtpDev: null,
    });
  },

  /** Re-hydrate from localStorage (e.g. after storage events) */
  hydrate: () => set(readInitial()),
}));

export default useAuthStore;
