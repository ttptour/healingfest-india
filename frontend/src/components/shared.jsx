import { motion } from "framer-motion";

export const scrollToId = (id) => {
  const el = document.querySelector(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -64, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export const EASE = [0.22, 1, 0.36, 1];

export const Reveal = ({ children, delay = 0, y = 34, className = "" }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.85, delay, ease: EASE }}
  >
    {children}
  </motion.div>
);

export const SectionHead = ({ eyebrow, title, dark = false, align = "left" }) => (
  <Reveal className={align === "center" ? "text-center" : ""}>
    <p className={`eyebrow ${dark ? "!text-[#C5A059]" : ""}`}>{eyebrow}</p>
    <h2
      className={`font-display mt-4 text-3xl sm:text-4xl lg:text-[3.4rem] leading-[1.05] font-medium tracking-tight ${
        dark ? "text-[#F8F5F0]" : "text-[#1A2421]"
      }`}
    >
      {title}
    </h2>
  </Reveal>
);

export const LotusMark = ({ size = 30, stroke = "#C5A059" }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" aria-hidden="true">
    <g stroke={stroke} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M32 12c4.2 5.4 6.3 9.8 6.3 13.8 0 4.4-2.4 8.3-6.3 10.4-3.9-2.1-6.3-6-6.3-10.4 0-4 2.1-8.4 6.3-13.8Z" />
      <path d="M18.5 21.5c6.4 1.8 9.8 5.7 10.9 9.9.8 3.1-.6 6.5-3.8 8.8-4.3-2-7.4-5.3-7.9-9.5-.4-3 .3-6.2.8-9.2Z" />
      <path d="M45.5 21.5c-6.4 1.8-9.8 5.7-10.9 9.9-.8 3.1.6 6.5 3.8 8.8 4.3-2 7.4-5.3 7.9-9.5.4-3-.3-6.2-.8-9.2Z" />
      <path d="M12 36.5c4.4 8.6 11.4 13 20 13s15.6-4.4 20-13" />
    </g>
  </svg>
);
