import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { LotusMark, scrollToId } from "./shared";
import { EVENT } from "./data";

const LINKS = [
  ["Overview", "#overview"],
  ["Pillars", "#pillars"],
  ["Healing", "#healing"],
  ["Schedule", "#schedule"],
  ["Venue", "#venue"],
];

const Nav = () => {
  const [open, setOpen] = useState(false);
  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <motion.header
      initial={{ y: -70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      className="fixed top-0 inset-x-0 z-50 border-b border-[#E2DDD5] bg-[#F8F5F0]/85 backdrop-blur-md"
      data-testid="nav-main"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <button
          onClick={() => go("#top")}
          className="flex items-center gap-3 text-left"
          data-testid="nav-brand"
          aria-label="Back to top"
        >
          <LotusMark size={28} />
          <span className="leading-tight">
            <span className="font-display block text-[1.05rem] font-semibold text-[#1A2421]">
              International Healing Retreat
            </span>
            <span className="block text-[0.6rem] tracking-[0.3em] uppercase text-[#A8833E]">
              India · Feb 2027
            </span>
          </span>
        </button>

        <nav className="hidden lg:flex items-center gap-8">
          {LINKS.map(([label, id]) => (
            <button
              key={id}
              onClick={() => go(id)}
              className="gold-underline text-[0.82rem] font-medium tracking-wide text-[#4A554D] hover:text-[#1A2421] transition-colors"
              data-testid={`nav-link-${label.toLowerCase()}`}
            >
              {label}
            </button>
          ))}
          <button
            onClick={() => go("#enquire")}
            className="rounded-full bg-[#131C18] px-5 py-2.5 text-[0.8rem] font-semibold tracking-wide text-[#F8F5F0] transition-all duration-300 hover:bg-[#C5A059] hover:text-[#131C18]"
            data-testid="nav-cta-btn"
          >
            Reserve Your Place
          </button>
        </nav>

        <button
          className="lg:hidden p-2 text-[#1A2421]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          data-testid="nav-mobile-toggle"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t border-[#E2DDD5] bg-[#F8F5F0]"
            data-testid="nav-mobile-panel"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {LINKS.map(([label, id]) => (
                <button
                  key={id}
                  onClick={() => go(id)}
                  className="py-2.5 text-left text-[0.95rem] text-[#4A554D] border-b border-[#E2DDD5]/60"
                  data-testid={`nav-mobile-link-${label.toLowerCase()}`}
                >
                  {label}
                </button>
              ))}
              <button
                onClick={() => go("#enquire")}
                className="mt-3 rounded-full bg-[#131C18] px-5 py-3 text-[0.85rem] font-semibold text-[#F8F5F0]"
                data-testid="nav-mobile-cta"
              >
                Reserve Your Place
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Nav;
