import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, Mail, User } from "lucide-react";
import { AuthLayout } from "../../Components/layout/AuthLayout";
import { Button, Input, notify } from "../../Components/ui";
import { signupSchema } from "../../lib/validations/auth.schema";
import { authApi } from "../../lib/api/auth.api";
import { useAuthStore } from "../../store/useAuthStore";

export default function SignupPage() {
  const navigate = useNavigate();
  const setPendingVerification = useAuthStore((s) => s.setPendingVerification);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const onSubmit = async (values) => {
    setFormError("");
    try {
      const { data } = await authApi.register(values);

      if (data.requiresOtp) {
        setPendingVerification({ email: data.email, otp: data.otp });
        notify.success(
          "Check your inbox",
          process.env.NODE_ENV !== "production" && data.otp
            ? `Dev OTP: ${data.otp}`
            : "We sent a 6-digit verification code."
        );
        navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
        return;
      }

      notify.success("Account created", "You can sign in now.");
      navigate("/login");
    } catch (err) {
      setFormError(err.message || "Registration failed");
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join AutoFixHub to book repairs, order parts, and track everything in one place."
      step={0}
      totalSteps={2}
      footer={
        <>
          Already registered?{" "}
          <Link to="/login" className="font-semibold text-brand-400 hover:text-brand-300">
            Sign in
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
          label="Email"
          type="email"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          leftIcon={<Lock className="h-4 w-4" />}
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" magnetic className="w-full" isLoading={isSubmitting}>
          Continue
        </Button>
      </form>
    </AuthLayout>
  );
}
