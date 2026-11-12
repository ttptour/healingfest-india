import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, SectionHead } from "./shared";
import { VENUE_FEATURES, EVENT } from "./data";

const DOME_IMG =
  "https://static.prod-images.emergentagent.com/jobs/c9363e39-1266-4b7e-b4bf-3bc838b5f14e/images/8618ac6c2d989f4ad4fc1d029a34817f5c4dbce706079a87731934b1976fb319.jpeg";

const Venue = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="venue" className="py-24 sm:py-32" data-testid="venue-section">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
          <SectionHead
            eyebrow="The Venue"
            title={
              <>
                Your home for six days — <span className="italic text-[#A8833E]">Kanha Shanti Vanam</span>
              </>
            }
          />
          <Reveal delay={0.15}>
            <p className="font-display italic text-xl text-[#7A877E] lg:text-right">Stay · Meet · Meditate · Dine</p>
          </Reveal>
        </div>

        <Reveal>
          <div ref={ref} className="relative rounded-3xl overflow-hidden h-[420px] lg:h-[560px]" data-testid="venue-hero-image">
            <motion.img
              src={DOME_IMG}
              alt="The meditation dome over the green campus at golden hour"
              style={{ y: imgY }}
              className="absolute inset-0 h-[116%] w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131C18]/75 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 sm:bottom-9 sm:left-9 rounded-2xl bg-[#131C18]/65 backdrop-blur border border-[#C5A059]/30 px-6 py-5">
              <p className="eyebrow !text-[#E8CB96]">The Pearl Hotels</p>
              <p className="font-display mt-1.5 text-xl sm:text-2xl text-[#F8F5F0]">
                {EVENT.venue}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" data-testid="venue-features">
          {VENUE_FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={0.06 * i}>
              <div className="h-full rounded-2xl border border-[#E2DDD5] bg-white p-7 transition-all duration-300 hover:border-[#C5A059]/60 hover:shadow-lg">
                <span className="font-display italic text-lg text-[#C5A059]">0{i + 1}</span>
                <h3 className="mt-2 font-display text-xl sm:text-2xl text-[#1A2421]">{f.title}</h3>
                <p className="mt-2 text-[0.92rem] text-[#4A554D] leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Venue;
