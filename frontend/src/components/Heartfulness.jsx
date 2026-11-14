import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, SectionHead } from "./shared";
import { HEARTFULNESS_STEPS } from "./data";

const STEPS_IMG =
  "https://healingfestival.eu/wp-content/uploads/2026/09/DSC00225_WEB.webp";

const Heartfulness = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section className="py-24 sm:py-32 bg-[#131C18] relative overflow-hidden" data-testid="heartfulness-section">
      <span
        className="font-display absolute -bottom-10 left-1/2 -translate-x-1/2 text-[18vw] leading-none text-[#F8F5F0]/[0.035] italic select-none pointer-events-none whitespace-nowrap"
        aria-hidden="true"
      >
        stillness
      </span>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <SectionHead
            dark
            eyebrow="Heartfulness"
            title={
              <>
                One step at a time, <span className="italic text-[#E8CB96]">inward</span>
              </>
            }
          />
          <Reveal delay={0.15}>
            <p className="mt-6 text-[#B9C2BB] leading-relaxed max-w-xl">
              Each afternoon closes with a guided Heartfulness practice — deepening gently from
              relaxation to prayer, and finally to the world's largest meditation hall.
            </p>
          </Reveal>
          <div className="mt-10 divide-y divide-[#F8F5F0]/10 border-y border-[#F8F5F0]/10" data-testid="heartfulness-steps">
            {HEARTFULNESS_STEPS.map((s, i) => (
              <Reveal key={s.day} delay={0.08 * i}>
                <div className="group flex items-baseline gap-6 py-6 transition-colors duration-300 hover:bg-[#F8F5F0]/[0.04] hover:px-4 rounded-lg" data-testid={`heartfulness-step-${i + 1}`}>
                  <span className="font-display italic text-lg text-[#C5A059] w-16 shrink-0">{s.day}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-2xl sm:text-3xl text-[#F8F5F0] transition-colors duration-300 group-hover:text-[#E8CB96]">
                      {s.name}
                    </h3>
                    <p className="mt-1 text-[0.9rem] text-[#7A877E] italic font-display">{s.note}</p>
                  </div>
                  <span className="h-2 w-2 rounded-full bg-[#C5A059]/40 transition-all duration-300 group-hover:bg-[#C5A059] group-hover:scale-125" aria-hidden="true" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="lg:col-span-5 order-1 lg:order-2">
          <div ref={ref} className="lg:sticky lg:top-28">
            <div className="relative overflow-hidden rounded-2xl h-[380px] lg:h-[520px]">
              <motion.img
                src={STEPS_IMG}
                alt="Group practice outdoors at the festival lawn"
                style={{ y: imgY }}
                className="absolute inset-0 h-[112%] w-full object-cover"
                data-testid="heartfulness-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#131C18]/70 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 rounded-xl bg-[#131C18]/65 backdrop-blur border border-[#C5A059]/30 px-5 py-3">
                <p className="font-display italic text-[#E8CB96] text-lg">Meditation in the world's largest meditation hall</p>
              </div>
            </div>
            <p className="mt-6 text-[0.72rem] tracking-[0.25em] uppercase text-[#7A877E]">
              A guided practice to close each day
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Heartfulness;
