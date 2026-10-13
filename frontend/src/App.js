import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import HomePage from "./Components/HomePage";
import Services from "./Components/Services";
import CarParts from "./Components/CarParts";
import AboutUs from "./Components/AboutUs";
import Contact from "./Components/Contact";
import SignupPage from "./pages/auth/SignupPage";
import LoginPage from "./pages/auth/LoginPage";
import VerifyOtpPage from "./pages/auth/VerifyOtpPage";
import ProductDetails from "./Components/ProductDetails";
import Cart from "./Components/Cart";
import AppointmentForm from "./Components/AppointmentForm";
import Profile from "./Components/Profile";
import Sidebar from "./Components/Admin/sidebar";
import Checkout from "./Components/Checkout";
import Dashboard from "./Components/Admin/Dashboard";
import MechanicDashboard from "./Components/Mechanic/Dashboard";
import AdminAppointments from "./Components/Admin/adminAppointments";
import AdminUsers from "./Components/Admin/adminUsers";
import AdminOrders from "./Components/Admin/adminOrders";
import AdminServices from "./Components/Admin/adminServices";
import AdminProducts from "./Components/Admin/adminProducts";
import { PublicLayout } from "./Components/layout/PublicLayout";
import { CartProvider } from "./Components/CartContext";
import { ProtectedRoute } from "./app/router/ProtectedRoute";
import { RoleRoute } from "./app/router/RoleRoute";
import { useAuthStore } from "./store/useAuthStore";
import { apiClient } from "./lib/api/client";

function App() {
  const {
    isAuthenticated,
    isAdmin,
    isMechanic,
    username,
    hydrate,
    setSession,
  } = useAuthStore();
  const [profileImage, setProfileImage] = useState(null);

  const handleProfileImageUpdate = (imageUrl) => {
    setProfileImage(imageUrl);
  };

  const handleAuthSuccess = () => {
    hydrate();
  };

  // Re-sync auth state on storage events (multi-tab support)
  useEffect(() => {
    const onStorage = () => hydrate();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [hydrate]);

  // Sync profile image + session on login
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!isAuthenticated) {
        setProfileImage(null);
        return;
      }
      try {
        const { data } = await apiClient.get("/users/profile");
        if (data?.profileImage) {
          setProfileImage(`http://localhost:3000${data.profileImage}`);
        }
        if (data) {
          const token = localStorage.getItem("authToken");
          if (token) {
            setSession({
              token,
              userId: data._id || data.userId,
              username: data.username,
              email: data.email,
              isAdmin: data.isAdmin,
              isMechanic: data.isMechanic,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };
    fetchUserProfile();
  }, [isAuthenticated, setSession]);

  const isStaff = isAuthenticated && (isAdmin || isMechanic);

  return (
    <Router>
      <CartProvider>
        {/* ── Global toast provider ── */}
        <Toaster
          position="top-right"
          richColors
          closeButton
          toastOptions={{ duration: 4000 }}
        />

        <div className="App">
          {/* ── Staff sidebar — fixed, offset content ── */}
          {isStaff && (
            <Sidebar profileImage={profileImage} username={username} />
          )}

          {/* ── Main content with sidebar offset ── */}
          <main
            className={
              isStaff
                ? "ml-[260px] min-h-screen transition-all duration-300"
                : ""
            }
          >
            <Routes>
              {/* ── Auth routes (no layout) ── */}
              <Route
                path="/login"
                element={<LoginPage onLogin={handleAuthSuccess} />}
              />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/verify-otp"
                element={<VerifyOtpPage onLogin={handleAuthSuccess} />}
              />

              {/* ── Public routes (with Navbar) ── */}
              <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<Services />} />
                <Route path="/car-parts" element={<CarParts />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/appointmentForm"
                  element={
                    <ProtectedRoute>
                      <AppointmentForm />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute allowStaff>
                      <Profile onProfileImageUpdate={handleProfileImageUpdate} />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* ── Admin routes ── */}
              <Route
                path="/admin/dashboard"
                element={
                  <RoleRoute roles={["admin"]}>
                    <Dashboard />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/appointments"
                element={
                  <RoleRoute roles={["admin"]}>
                    <AdminAppointments />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <RoleRoute roles={["admin"]}>
                    <AdminUsers />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <RoleRoute roles={["admin"]}>
                    <AdminOrders />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/services"
                element={
                  <RoleRoute roles={["admin"]}>
                    <AdminServices />
                  </RoleRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <RoleRoute roles={["admin"]}>
                    <AdminProducts />
                  </RoleRoute>
                }
              />

              {/* ── Mechanic routes ── */}
              <Route
                path="/mechanic/dashboard"
                element={
                  <RoleRoute roles={["mechanic"]}>
                    <MechanicDashboard />
                  </RoleRoute>
                }
              />
            </Routes>
          </main>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
