import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { EVENT } from "./data";
import { EASE, scrollToId } from "./shared";

const HERO_IMG =
  "https://static.prod-images.emergentagent.com/jobs/c9363e39-1266-4b7e-b4bf-3bc838b5f14e/images/102affe1a0cbf69d13b5a993af6ca24694db2bfb18ff18b3a1bfa30a6a63c127.jpeg";

const lineReveal = (i) => ({
  initial: { y: "115%" },
  animate: { y: "0%" },
  transition: { duration: 1.15, delay: 0.45 + i * 0.2, ease: EASE },
});

const fade = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: EASE },
});

const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.35]);

  return (
    <section id="top" ref={ref} className="relative min-h-screen flex flex-col overflow-hidden isolate" data-testid="hero-section">
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Golden dawn over a healing retreat in India"
          className="h-[115%] w-full object-cover"
        />
      </motion.div>
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-gradient-to-b from-[#131C18]/70 via-[#131C18]/45 to-[#131C18]/80" />

      <div className="relative flex-1 flex flex-col justify-end max-w-7xl mx-auto w-full px-5 sm:px-8 pt-32 pb-14">
        <motion.p {...fade(0.25)} className="eyebrow !text-[#E8CB96] mb-6" data-testid="hero-eyebrow">
          International Healing Workshop · Mind, Body & Soul
        </motion.p>

        <h1 className="font-display text-[#F8F5F0] font-medium leading-[0.98] tracking-tight text-5xl sm:text-7xl lg:text-[6.5rem]">
          <span className="block overflow-hidden pb-1">
            <motion.span {...lineReveal(0)} className="block">Come Home</motion.span>
          </span>
          <span className="block overflow-hidden pb-2">
            <motion.span {...lineReveal(1)} className="block italic text-[#E8CB96]">to Yourself</motion.span>
          </span>
        </h1>

        <motion.p {...fade(0.95)} className="mt-7 max-w-2xl text-base sm:text-lg text-[#F1EDE4]/90 leading-relaxed" data-testid="hero-subline">
          A six-day journey of healing, stillness and renewal — yoga at sunrise, Ayurveda chosen
          for you, and evenings of music, craft and celebration.
        </motion.p>

        <motion.div {...fade(1.1)} className="mt-9 flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#C5A059]/50 bg-[#131C18]/40 backdrop-blur px-5 py-2.5 text-[0.8rem] tracking-[0.14em] uppercase text-[#E8CB96]" data-testid="hero-dates">
            {EVENT.dates} · {EVENT.duration}
          </span>
          <span className="inline-flex items-center gap-2 text-[0.8rem] tracking-[0.14em] uppercase text-[#F1EDE4]/75" data-testid="hero-venue">
            {EVENT.venue}
          </span>
        </motion.div>

        <motion.div {...fade(1.25)} className="mt-8 flex flex-wrap gap-4">
          <button
            onClick={() => scrollToId("#enquire")}
            className="group rounded-full bg-[#C5A059] px-8 py-4 text-[0.85rem] font-semibold tracking-wide text-[#131C18] transition-all duration-300 hover:bg-[#F8F5F0]"
            data-testid="hero-cta-book"
          >
            Request Availability & Pricing
          </button>
          <button
            onClick={() => scrollToId("#overview")}
            className="rounded-full border border-[#F8F5F0]/40 px-8 py-4 text-[0.85rem] font-semibold tracking-wide text-[#F8F5F0] transition-all duration-300 hover:border-[#C5A059] hover:text-[#E8CB96]"
            data-testid="hero-cta-explore"
          >
            Explore the Journey
          </button>
        </motion.div>
      </div>

      <motion.div {...fade(1.6)} className="relative max-w-7xl mx-auto w-full px-5 sm:px-8 pb-8 flex items-center justify-between z-10">
        <span className="text-[0.7rem] tracking-[0.3em] uppercase text-[#F1EDE4]/60">Registrations Open</span>
        <span className="float-cue text-[#E8CB96]" aria-hidden="true">
          <ArrowDown size={18} />
        </span>
      </motion.div>
    </section>
  );
};

export default Hero;
