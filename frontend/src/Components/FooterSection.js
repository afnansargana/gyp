import React from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, Phone, Wrench } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="border-t border-ink-800 bg-ink-950 text-ink-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-2.5 text-ink-50">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-400 ring-1 ring-brand-400/30">
              <Wrench className="h-4 w-4" />
            </span>
            <span className="font-display text-lg font-semibold">AutoFixHub</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-ink-400">
            Precision auto repair and genuine parts in Islamabad — booked in
            minutes, tracked end to end.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-ink-100">
            Explore
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/" className="transition hover:text-brand-300">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="transition hover:text-brand-300">
                Services
              </Link>
            </li>
            <li>
              <Link to="/car-parts" className="transition hover:text-brand-300">
                Car parts
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="transition hover:text-brand-300">
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition hover:text-brand-300">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-ink-100">
            Contact
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <span>H-10, Islamabad, Pakistan</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-brand-400" />
              <span>(301) 234-5678</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="h-4 w-4 shrink-0 text-brand-400" />
              <a
                href="mailto:ammarnazir864@gmail.com"
                className="transition hover:text-brand-300"
              >
                ammarnazir864@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-800 py-4 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} AutoFixHub. All rights reserved.
      </div>
    </footer>
  );
};

export default FooterSection;
