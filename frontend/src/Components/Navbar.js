import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, ShoppingCart, User, X, Wrench } from "lucide-react";
import { cn } from "../lib/utils";
import { useAuthStore } from "../store/useAuthStore";
import { apiClient } from "../lib/api/client";

const links = [
  { to: "/services", label: "Services" },
  { to: "/car-parts", label: "Parts" },
  { to: "/ai-diagnostics", label: "AI Diagnostics" },
  { to: "/about-us", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { isAuthenticated, username, clearSession } = useAuthStore();
  const solidNav = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) {
        setProfileImage(null);
        return;
      }
      try {
        const res = await apiClient.get("/users/profile");
        if (res.data?.profileImage) {
          setProfileImage(`http://localhost:3000${res.data.profileImage}`);
        }
      } catch {
        /* guest or expired session */
      }
    };
    fetchProfile();
  }, [isAuthenticated]);

  const linkClass = ({ isActive }) =>
    cn(
      "text-sm font-medium transition",
      isActive ? "text-brand-400" : "text-ink-200 hover:text-white"
    );

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition duration-300",
        solidNav
          ? "border-b border-white/10 bg-ink-950/90 shadow-glass backdrop-blur-xl"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:h-[4.25rem] sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 ring-1 ring-brand-400/30">
            <Wrench className="h-4 w-4" strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white sm:text-xl">
            AutoFixHub
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            to="/cart"
            className="rounded-xl p-2 text-ink-200 transition hover:bg-white/5 hover:text-white"
            aria-label="Cart"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-ink-100 transition hover:bg-white/5"
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt=""
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20"
                />
              ) : (
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink-800 text-ink-300">
                  <User className="h-4 w-4" />
                </span>
              )}
              <span className="hidden text-sm font-medium lg:inline">
                {username || "Account"}
              </span>
            </button>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-xl bg-brand-500 px-3.5 py-2 text-sm font-semibold text-ink-950 transition hover:bg-brand-400 sm:inline-flex"
            >
              Sign in
            </Link>
          )}

          <button
            type="button"
            className="rounded-xl p-2 text-ink-100 md:hidden"
            onClick={() => setIsOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-white/10 bg-ink-950/95 backdrop-blur-xl md:hidden"
          >
            <div className="space-y-1 px-4 py-3">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "block rounded-xl px-3 py-2.5 text-sm font-medium",
                      isActive
                        ? "bg-brand-500/10 text-brand-300"
                        : "text-ink-200 hover:bg-white/5"
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="mt-2 block rounded-xl bg-brand-500 px-3 py-2.5 text-center text-sm font-semibold text-ink-950"
                >
                  Sign in
                </Link>
              )}
              {isAuthenticated && (
                <button
                  type="button"
                  className="mt-2 w-full rounded-xl px-3 py-2.5 text-left text-sm text-ink-400 hover:bg-white/5"
                  onClick={() => {
                    clearSession();
                    setIsOpen(false);
                    navigate("/login");
                  }}
                >
                  Sign out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
