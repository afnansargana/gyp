import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";
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
import { PublicLayout } from "./components/layout/PublicLayout";
import { CartProvider } from "./Components/CartContext";

function RequireAuth({ children, isAdmin, isMechanic }) {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("authToken");

  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  if (isAdmin && location.pathname.startsWith("/admin")) {
    return children;
  }

  if (isMechanic && location.pathname.startsWith("/mechanic")) {
    return children;
  }

  if (isAdmin) {
    return <Navigate to="/admin/dashboard" />;
  }

  if (isMechanic) {
    return <Navigate to="/mechanic/dashboard" />;
  }

  return children;
}

function syncAuthFlags(setIsLoggedIn, setIsAdmin, setIsMechanic) {
  setIsLoggedIn(!!localStorage.getItem("authToken"));
  setIsAdmin(JSON.parse(localStorage.getItem("isAdmin") || "false"));
  setIsMechanic(JSON.parse(localStorage.getItem("isMechanic") || "false"));
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("authToken")
  );
  const [isAdmin, setIsAdmin] = useState(
    () => JSON.parse(localStorage.getItem("isAdmin") || "false")
  );
  const [isMechanic, setIsMechanic] = useState(
    () => JSON.parse(localStorage.getItem("isMechanic") || "false")
  );
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState("");

  const handleProfileImageUpdate = (imageUrl) => {
    setProfileImage(imageUrl);
  };

  const handleAuthSuccess = () => {
    syncAuthFlags(setIsLoggedIn, setIsAdmin, setIsMechanic);
  };

  useEffect(() => {
    const handleStorageChange = () => {
      syncAuthFlags(setIsLoggedIn, setIsAdmin, setIsMechanic);
    };

    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await axios.get(
          "http://localhost:3000/api/users/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data) {
          setUsername(response.data.username);
          if (response.data.profileImage) {
            setProfileImage(
              `http://localhost:3000${response.data.profileImage}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchUserProfile();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <Router>
      <CartProvider>
        <div className="App">
          {isLoggedIn && (isAdmin || isMechanic) && (
            <Sidebar profileImage={profileImage} username={username} />
          )}
          <Routes>
            <Route
              path="/login"
              element={<LoginPage onLogin={handleAuthSuccess} />}
            />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/verify-otp"
              element={<VerifyOtpPage onLogin={handleAuthSuccess} />}
            />

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
                  <RequireAuth isAdmin={isAdmin} isMechanic={isMechanic}>
                    <Cart />
                  </RequireAuth>
                }
              />
              <Route
                path="/appointmentForm"
                element={
                  <RequireAuth isAdmin={isAdmin} isMechanic={isMechanic}>
                    <AppointmentForm />
                  </RequireAuth>
                }
              />
              <Route
                path="/profile"
                element={
                  <RequireAuth isAdmin={isAdmin} isMechanic={isMechanic}>
                    <Profile
                      onProfileImageUpdate={handleProfileImageUpdate}
                    />
                  </RequireAuth>
                }
              />
              <Route
                path="/checkout"
                element={
                  <RequireAuth isAdmin={isAdmin} isMechanic={isMechanic}>
                    <Checkout />
                  </RequireAuth>
                }
              />
            </Route>

            <Route
              path="/admin/dashboard"
              element={
                <RequireAuth isAdmin={isAdmin}>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/appointments"
              element={
                <RequireAuth isAdmin={isAdmin}>
                  <AdminAppointments />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/users"
              element={
                <RequireAuth isAdmin={isAdmin}>
                  <AdminUsers />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <RequireAuth isAdmin={isAdmin}>
                  <AdminOrders />
                </RequireAuth>
              }
            />
            <Route
              path="/mechanic/dashboard"
              element={
                <RequireAuth isMechanic={isMechanic}>
                  <MechanicDashboard />
                </RequireAuth>
              }
            />
            <Route path="/admin/services" element={<AdminServices />} />
            <Route path="/admin/products" element={<AdminProducts />} />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
