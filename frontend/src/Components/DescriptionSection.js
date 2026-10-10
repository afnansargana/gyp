import React from "react";
import { useNavigate } from "react-router-dom";
import engineImg from "../Assets/engine.jpg";
import { FadeIn } from "../components/motion/FadeIn";
import { MagneticButton } from "../components/motion/MagneticButton";

const DescriptionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <FadeIn>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink-900 sm:text-4xl">
            Workshop craftsmanship, digital convenience
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-500 sm:text-lg">
            AutoFixHub pairs skilled mechanics with modern diagnostics so you
            get clear answers, honest timelines, and work that lasts — whether
            you need a quick inspection or a major repair.
          </p>
          <MagneticButton
            onClick={() => navigate("/services")}
            className="btn-primary mt-8"
          >
            View services
          </MagneticButton>
        </FadeIn>

        <FadeIn delay={0.12} className="relative">
          <div className="overflow-hidden rounded-2xl shadow-lift ring-1 ring-ink-200">
            <img
              src={engineImg}
              alt="Engine bay at AutoFixHub workshop"
              className="h-full w-full object-cover"
            />
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default DescriptionSection;
