import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../Assets/background.jpg";
import { MagneticButton } from "./motion/MagneticButton";

const BackgroundSection = () => {
  const navigate = useNavigate();

  const handleAppointmentClick = () => {
    if (!localStorage.getItem("authToken")) {
      navigate("/login", { state: { from: "/appointmentForm" } });
      return;
    }
    navigate("/appointmentForm");
  };

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-ink-950/75 via-ink-950/55 to-ink-950/90"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.45)_70%)]"
        aria-hidden
      />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-4 pb-16 pt-28 text-center sm:px-6">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl md:text-6xl"
        >
          AutoFixHub
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 max-w-xl font-sans text-lg font-medium leading-snug text-ink-200 sm:text-xl"
        >
          Expert repair and genuine parts — booked in minutes.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-3 max-w-md text-sm leading-relaxed text-ink-400 sm:text-base"
        >
          Islamabad&apos;s workshop for diagnostics, mechanical work, and
          electrical service you can trust.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10"
        >
          <MagneticButton
            onClick={handleAppointmentClick}
            className="btn-primary px-7 py-3.5 text-base"
          >
            Book an appointment
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
};

export default BackgroundSection;
