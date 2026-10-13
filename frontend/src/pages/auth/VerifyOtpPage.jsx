import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { AuthLayout } from "../../Components/layout/AuthLayout";
import { OtpInput } from "../../Components/auth/OtpInput";
import { Button, notify } from "../../Components/ui";
import { authApi } from "../../lib/api/auth.api";
import { useAuthStore } from "../../store/useAuthStore";

const RESEND_SECONDS = 60;

/* ── Circular countdown ring ── */
function CountdownRing({ seconds, total }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const progress = seconds / total;
  const dashoffset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="52" height="52" className="-rotate-90">
        {/* Track */}
        <circle cx="26" cy="26" r={radius} stroke="rgb(30 41 59)" strokeWidth="3" fill="none" />
        {/* Progress */}
        <motion.circle
          cx="26"
          cy="26"
          r={radius}
          stroke="rgb(6 182 212)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          animate={{ strokeDashoffset: dashoffset }}
          transition={{ duration: 0.4 }}
        />
      </svg>
      <span className="absolute font-mono text-xs font-bold text-brand-400">
        {seconds}s
      </span>
    </div>
  );
}

export default function VerifyOtpPage({ onLogin }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setSession = useAuthStore((s) => s.setSession);
  const clearPending = useAuthStore((s) => s.clearPendingVerification);
  const homePathForRole = useAuthStore((s) => s.homePathForRole);
  const pendingEmail = useAuthStore((s) => s.pendingEmail);
  const pendingOtpDev = useAuthStore((s) => s.pendingOtpDev);

  const email = searchParams.get("email") || pendingEmail || "";

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (!email) {
      notify.error("Missing email", "Start from sign up again.");
      navigate("/signup");
    }
  }, [email, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const submitOtp = async (code) => {
    if (code.length !== 6 || isSubmitting) return;
    setIsSubmitting(true);
    setError("");
    setStatus("idle");

    try {
      const { data } = await authApi.verifyOtp({ email, otp: code });
      setStatus("success");
      setSession(data);
      clearPending();
      onLogin?.();
      notify.success("Verified! 🎉", "Your account is ready.");
      setTimeout(() => navigate(homePathForRole()), 650);
    } catch (err) {
      setStatus("error");
      setError(err.message || "Invalid OTP. Please try again.");
      setTimeout(() => setStatus("idle"), 600);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (value) => {
    setOtp(value);
    setError("");
    if (value.length === 6) {
      submitOtp(value);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    try {
      const { data } = await authApi.resendOtp({ email });
      useAuthStore.getState().setPendingVerification({
        email: data.email,
        otp: data.otp,
      });
      setCooldown(RESEND_SECONDS);
      setOtp("");
      notify.success(
        "Code resent",
        data.otp ? `Dev OTP: ${data.otp}` : "Check your email."
      );
    } catch (err) {
      const retry = err.data?.retryAfterMs;
      if (retry) setCooldown(Math.ceil(retry / 1000));
      notify.error("Could not resend", err.message);
    }
  };

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={
        email
          ? `We sent a 6-digit code to ${email}`
          : "Enter the 6-digit verification code"
      }
      step={1}
      totalSteps={2}
      footer={
        <>
          Wrong email?{" "}
          <Link to="/signup" className="font-semibold text-brand-400 hover:text-brand-300">
            Go back
          </Link>
        </>
      }
    >
      <div className="space-y-6">
        {/* Dev OTP hint */}
        {process.env.NODE_ENV !== "production" && pendingOtpDev && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-2 text-center text-xs text-brand-200"
          >
            Dev mode OTP:{" "}
            <span className="font-mono font-semibold">{pendingOtpDev}</span>
          </motion.p>
        )}

        {/* OTP Input */}
        <OtpInput
          value={otp}
          onChange={handleOtpChange}
          status={status}
          disabled={isSubmitting || status === "success"}
        />

        {/* Error / Success feedback */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.p
              key={error}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-sm text-accent-rose"
              role="alert"
            >
              {error}
            </motion.p>
          )}
          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-sm text-accent-emerald"
            >
              <CheckCircle2 className="h-4 w-4" />
              Verified — redirecting…
            </motion.p>
          )}
        </AnimatePresence>

        {/* Submit */}
        <Button
          type="button"
          className="w-full"
          isLoading={isSubmitting}
          disabled={otp.length !== 6 || status === "success"}
          onClick={() => submitOtp(otp)}
        >
          Verify code
        </Button>

        {/* Resend with countdown ring */}
        <div className="flex items-center justify-center gap-3 text-sm text-ink-400">
          <span>Didn&apos;t get a code?</span>
          {cooldown > 0 ? (
            <CountdownRing seconds={cooldown} total={RESEND_SECONDS} />
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-brand-400 hover:text-brand-300 transition"
            >
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}
