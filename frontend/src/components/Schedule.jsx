import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionHead, EASE } from "./shared";
import { SCHEDULE } from "./data";

const Schedule = () => {
  const [active, setActive] = useState(0);
  const day = SCHEDULE[active];

  return (
    <section id="schedule" className="py-24 sm:py-32 bg-[#EFECE6] border-y border-[#E2DDD5]" data-testid="schedule-timeline-section">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <SectionHead
            align="center"
            eyebrow="The Programme"
            title={
              <>
                The six-day <span className="italic text-[#A8833E]">journey</span>
              </>
            }
          />
          <Reveal delay={0.15}>
            <p className="mt-6 text-[#4A554D] leading-relaxed">
              From the first garland at the airport to the festive farewell feast — every hour,
              gently held.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12 flex gap-2 sm:gap-3 justify-start lg:justify-center overflow-x-auto pb-2 lg:overflow-visible" data-testid="schedule-day-tabs">
            {SCHEDULE.map((d, i) => (
              <button
                key={d.day}
                onClick={() => setActive(i)}
                className={`shrink-0 rounded-full px-5 sm:px-6 py-3 text-[0.82rem] font-semibold tracking-wide transition-all duration-300 border ${
                  active === i
                    ? "bg-[#131C18] text-[#F8F5F0] border-[#131C18]"
                    : "bg-white/60 text-[#4A554D] border-[#E2DDD5] hover:border-[#C5A059] hover:text-[#1A2421]"
                }`}
                data-testid={`schedule-tab-day-${d.day}`}
              >
                Day {d.day}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="rounded-2xl bg-white border border-[#E2DDD5] overflow-hidden shadow-sm"
              data-testid={`schedule-panel-day-${day.day}`}
            >
              <div className="px-7 sm:px-10 py-7 border-b border-[#E2DDD5] bg-[#F8F5F0] flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="eyebrow">Day {day.day}</p>
                  <h3 className="font-display mt-1.5 text-2xl sm:text-3xl text-[#1A2421]">{day.theme}</h3>
                </div>
                <p className="font-display italic text-[#A8833E] text-lg">{day.sub}</p>
              </div>
              <ul className="divide-y divide-[#E2DDD5]/70">
                {day.items.map(([time, activity], i) => (
                  <motion.li
                    key={`${day.day}-${i}`}
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.03 * i, ease: EASE }}
                    className="flex flex-wrap sm:flex-nowrap items-baseline gap-x-6 gap-y-1 px-7 sm:px-10 py-3.5 hover:bg-[#F4ECE1]/60 transition-colors duration-200"
                    data-testid={`schedule-item-${day.day}-${i}`}
                  >
                    <span className="w-28 sm:w-36 shrink-0 text-[0.75rem] font-semibold tracking-[0.12em] uppercase text-[#A8833E]">
                      {time}
                    </span>
                    <span className="text-[0.95rem] text-[#4A554D]">{activity}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Schedule;
