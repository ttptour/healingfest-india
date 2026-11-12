import { motion } from "framer-motion";
import { Reveal, SectionHead, EASE } from "./shared";
import { HEARTFULNESS_STEPS } from "./data";

const Heartfulness = () => (
  <section className="py-24 sm:py-32 bg-[#131C18] relative overflow-hidden" data-testid="heartfulness-section">
    <span
      className="font-display absolute -bottom-16 left-1/2 -translate-x-1/2 text-[22vw] leading-none text-[#F8F5F0]/[0.04] italic select-none pointer-events-none whitespace-nowrap"
      aria-hidden="true"
    >
      stillness
    </span>

    <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
      <div className="max-w-2xl">
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
          <p className="mt-6 text-[#B9C2BB] leading-relaxed">
            Each afternoon closes with a guided Heartfulness practice — deepening gently from
            relaxation to prayer, and finally to the world's largest meditation hall.
          </p>
        </Reveal>
      </div>

      <div className="mt-16 relative" data-testid="heartfulness-steps">
        <div className="absolute left-[7px] lg:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-[#C5A059]/10 via-[#C5A059]/60 to-[#C5A059]/10 lg:-translate-x-1/2" aria-hidden="true" />
        <div className="space-y-12">
          {HEARTFULNESS_STEPS.map((s, i) => (
            <motion.div
              key={s.day}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.08 * i, ease: EASE }}
              className={`relative flex lg:w-1/2 ${i % 2 === 0 ? "lg:pr-14 lg:pl-0" : "lg:ml-auto lg:pl-10"} pl-10`}
              data-testid={`heartfulness-step-${i + 1}`}
            >
              <span
                className={`absolute top-2 h-3.5 w-3.5 rounded-full border-2 border-[#C5A059] bg-[#131C18] ${
                  i % 2 === 0 ? "left-0 lg:left-auto lg:-right-[7px]" : "left-0 lg:-left-[7px]"
                }`}
                aria-hidden="true"
              />
              <div className={`w-full rounded-2xl border border-[#C5A059]/25 bg-[#1C2822]/80 backdrop-blur p-6 sm:p-7 ${i % 2 === 0 ? "lg:text-right" : ""}`}>
                <p className="eyebrow !text-[#C5A059]">{s.day}</p>
                <h3 className="font-display mt-2 text-2xl sm:text-3xl text-[#F8F5F0]">{s.name}</h3>
                <p className="mt-1.5 text-[0.92rem] text-[#B9C2BB] italic font-display">{s.note}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default Heartfulness;
