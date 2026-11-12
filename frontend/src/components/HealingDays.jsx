import { Reveal, SectionHead } from "./shared";
import { HEALING_DAYS } from "./data";

const BOWLS_IMG =
  "https://static.prod-images.emergentagent.com/jobs/c9363e39-1266-4b7e-b4bf-3bc838b5f14e/images/44b244535e58138b4f7d19bbd48b74d0ffea5993c0110918e37aa604ec3e43f6.jpeg";

const HealingDays = () => (
  <section id="healing" className="py-24 sm:py-32" data-testid="healing-section">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      <Reveal className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <div className="relative">
            <div className="absolute -bottom-4 -left-4 h-full w-full rounded-2xl bg-[#F4ECE1]" aria-hidden="true" />
            <img
              src={BOWLS_IMG}
              alt="Sound healing bowls and Ayurvedic vessels"
              className="relative rounded-2xl w-full h-[380px] lg:h-[480px] object-cover shadow-xl"
              data-testid="healing-image"
            />
          </div>
          <p className="mt-8 text-[0.72rem] tracking-[0.25em] uppercase text-[#7A877E]">
            A new healing practice each day
          </p>
        </div>
      </Reveal>

      <div className="lg:col-span-7">
        <SectionHead
          eyebrow="Holistic Therapies"
          title={
            <>
              A new healing practice <span className="italic text-[#A8833E]">each day</span>
            </>
          }
        />
        <Reveal delay={0.15}>
          <p className="mt-6 text-[#4A554D] leading-relaxed max-w-xl">
            Mornings are for therapy — in small batches, chosen with your Ayurveda doctor after a
            pulse reading on arrival.
          </p>
        </Reveal>
        <div className="mt-10 divide-y divide-[#E2DDD5] border-y border-[#E2DDD5]" data-testid="healing-days-list">
          {HEALING_DAYS.map((h, i) => (
            <Reveal key={h.day} delay={0.1 * i}>
              <div className="group flex items-baseline gap-6 py-7 transition-colors duration-300 hover:bg-[#F4ECE1]/50 hover:px-4 rounded-lg" data-testid={`healing-day-${i + 1}`}>
                <span className="font-display italic text-lg text-[#C5A059] w-16 shrink-0">{h.day}</span>
                <div className="flex-1">
                  <h3 className="font-display text-2xl sm:text-3xl text-[#1A2421] transition-colors duration-300 group-hover:text-[#A8833E]">
                    {h.name}
                  </h3>
                  <p className="mt-1 text-[0.9rem] text-[#7A877E]">{h.tag}</p>
                </div>
                <span className="h-2 w-2 rounded-full bg-[#C5A059]/40 transition-all duration-300 group-hover:bg-[#C5A059] group-hover:scale-125" aria-hidden="true" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default HealingDays;
