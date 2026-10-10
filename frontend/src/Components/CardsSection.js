import React from "react";
import { Car, Cog, Wrench } from "lucide-react";
import { FadeIn } from "../components/motion/FadeIn";
import { StaggerList } from "../components/motion/StaggerList";

const services = [
  {
    icon: Car,
    title: "Auto electrical",
    body: "Specialist diagnostics with modern scanning tools for complex electrical faults.",
  },
  {
    icon: Wrench,
    title: "Mechanical works",
    body: "From routine maintenance to major repairs — handled by experienced technicians.",
  },
  {
    icon: Cog,
    title: "Hybrid care",
    body: "Dedicated hybrid expertise so battery systems and drivetrains stay reliable.",
  },
];

const CardsSection = () => {
  return (
    <section className="relative z-10 -mt-16 bg-transparent px-4 pb-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <FadeIn className="mb-8 text-center sm:mb-10">
          <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
            What we fix best
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-ink-500 sm:text-base">
            Focused service lines so every visit has a clear specialist path.
          </p>
        </FadeIn>

        <StaggerList className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map(({ icon: Icon, title, body }) => (
            <article
              key={title}
              className="group rounded-2xl border border-ink-200/80 bg-white p-6 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:shadow-lift"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-ink-950">
                <Icon className="h-6 w-6" strokeWidth={1.75} />
              </div>
              <h3 className="font-display text-lg font-semibold text-ink-900">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-500">{body}</p>
            </article>
          ))}
        </StaggerList>
      </div>
    </section>
  );
};

export default CardsSection;
