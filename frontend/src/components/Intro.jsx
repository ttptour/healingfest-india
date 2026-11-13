import { Reveal, SectionHead } from "./shared";
import { INTRO } from "./data";

const INTRO_IMG =
  "https://healingfestival.eu/wp-content/uploads/2024/12/D3BC0B34-BA44-4009-899E-E793A1260C33.webp";

const Intro = () => (
  <section id="overview" className="py-24 sm:py-32" data-testid="intro-section">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
      <div className="lg:col-span-6">
        <SectionHead
          eyebrow="The Retreat"
          title={
            <>
              A six-day journey of <span className="italic text-[#A8833E]">healing, stillness</span> and renewal.
            </>
          }
        />
        <Reveal delay={0.15}>
          <p className="mt-8 text-lg text-[#4A554D] leading-relaxed">{INTRO.text1}</p>
          <p className="mt-5 text-base text-[#4A554D] leading-relaxed">{INTRO.text2}</p>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-10 flex flex-wrap gap-8 sm:gap-12" data-testid="intro-chips">
            {INTRO.chips.map((c) => (
              <div key={c.k}>
                <p className="font-display text-4xl sm:text-5xl text-[#1A2421]">
                  {c.k}
                  <span className="text-[#C5A059]">.</span>
                </p>
                <p className="mt-1 text-[0.72rem] tracking-[0.22em] uppercase text-[#7A877E]">{c.v}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2} className="lg:col-span-6">
        <div className="relative">
          <div className="absolute -top-4 -right-4 h-full w-full rounded-2xl border border-[#C5A059]/40" aria-hidden="true" />
          <img
            src={INTRO_IMG}
            alt="A guest embracing the morning air at the retreat"
            className="relative rounded-2xl w-full h-[420px] lg:h-[540px] object-cover shadow-2xl"
            data-testid="intro-image"
          />
          <div className="absolute bottom-5 left-5 rounded-xl bg-[#131C18]/70 backdrop-blur px-5 py-3 border border-[#C5A059]/30">
            <p className="font-display italic text-[#F8F5F0] text-lg">Mind · Body · Soul</p>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

export default Intro;
