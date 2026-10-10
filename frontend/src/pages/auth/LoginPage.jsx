import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { AuthLayout } from "../../components/layout/AuthLayout";
import { Button, Input, notify } from "../../components/ui";
import { loginSchema } from "../../lib/validations/auth.schema";
import { authApi } from "../../lib/api/auth.api";
import { useAuthStore } from "../../store/useAuthStore";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const setSession = useAuthStore((s) => s.setSession);
  const setPendingVerification = useAuthStore((s) => s.setPendingVerification);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const redirectByRole = (data) => {
    if (data.isAdmin) navigate("/admin/dashboard");
    else if (data.isMechanic) navigate("/mechanic/dashboard");
    else navigate("/");
  };

  const onSubmit = async (values) => {
    setFormError("");
    try {
      const { data } = await authApi.login(values);
      setSession(data);
      onLogin?.();
      notify.success("Welcome back", `Signed in as ${data.username || values.username}`);
      redirectByRole(data);
    } catch (err) {
      if (err.status === 403 && err.data?.requiresOtp) {
        setPendingVerification({
          email: err.data.email,
          otp: err.data.otp,
        });
        notify.info("Verify your email", "Enter the OTP to finish signing up.");
        navigate(`/verify-otp?email=${encodeURIComponent(err.data.email)}`);
        return;
      }
      setFormError(err.message || "Login failed");
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to book services, track orders, and manage your garage."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link to="/signup" className="font-semibold text-brand-400 hover:text-brand-300">
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <AnimatePresence mode="wait">
          {formError && (
            <motion.p
              key={formError}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-xl border border-accent-rose/30 bg-accent-rose/10 px-3 py-2 text-center text-sm text-rose-200"
              role="alert"
            >
              {formError}
            </motion.p>
          )}
        </AnimatePresence>

        <Input
          label="Username"
          autoComplete="username"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.username?.message}
          {...register("username")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
