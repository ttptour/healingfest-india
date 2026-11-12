import { Reveal, SectionHead } from "./shared";
import { PILLARS } from "./data";

const Pillars = () => (
  <section id="pillars" className="py-24 sm:py-32 bg-[#EFECE6] border-y border-[#E2DDD5]" data-testid="pillars-section">
    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
        <SectionHead
          eyebrow="A Curated Retreat"
          title={
            <>
              Five threads, woven <span className="italic text-[#A8833E]">into one journey</span>
            </>
          }
        />
        <Reveal delay={0.15}>
          <p className="max-w-sm text-[0.95rem] text-[#4A554D] leading-relaxed lg:text-right">
            Every element of the six days is curated — from the first garland at the airport to
            the tree that carries your name.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6" data-testid="pillars-bento-grid">
        {PILLARS.map((p, i) => (
          <Reveal
            key={p.num}
            delay={0.08 * i}
            className={`${p.span} group relative rounded-2xl bg-[#FFFFFF] border border-[#E2DDD5] overflow-hidden transition-all duration-500 hover:border-[#C5A059]/60 hover:shadow-xl`}
          >
            {p.img ? (
              <div className="relative h-full flex flex-col">
                {p.num === "02" ? (
                  <div className="relative flex-1 min-h-[18rem] overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                ) : (
                  <div className={`relative overflow-hidden ${p.imgH}`}>
                    <img
                      src={p.img}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                    />
                  </div>
                )}
                <div className="p-7">
                  <PillarBody p={p} />
                </div>
              </div>
            ) : (
              <div className="h-full p-7 sm:p-9 flex flex-col justify-between bg-[#131C18] rounded-2xl">
                <PillarBody p={p} dark />
                <p className="font-display italic text-[#E8CB96]/70 text-xl mt-6">
                  Received as prasad — every meal, every moment.
                </p>
              </div>
            )}
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const PillarBody = ({ p, dark = false }) => (
  <>
    <div className="flex items-baseline gap-4">
      <span className={`font-display text-2xl italic ${dark ? "text-[#C5A059]" : "text-[#C5A059]"}`}>{p.num}</span>
      <h3 className={`font-display text-2xl sm:text-[1.7rem] font-medium ${dark ? "text-[#F8F5F0]" : "text-[#1A2421]"}`}>
        {p.title}
      </h3>
    </div>
    <p className={`mt-3 text-[0.93rem] leading-relaxed ${dark ? "text-[#B9C2BB]" : "text-[#4A554D]"}`}>{p.desc}</p>
  </>
);

export default Pillars;
