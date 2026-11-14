import { Reveal, SectionHead } from "./shared";

const EXPERTS = [
  {
    name: "Acharya Dr. Shreevarma",
    role: "Chief Medical Director",
    img: "https://wellnessbyheartfulness.com/wp-content/uploads/2024/11/Sv-Sir-copy.webp",
  },
  {
    name: "TV Kamalak Kannan (KK)",
    role: "Chief Executive Officer",
    img: "https://wellnessbyheartfulness.com/wp-content/uploads/2026/04/Mr.-Kamalakkannan-TV.webp",
  },
  {
    name: "Bharadwaja",
    role: "General Manager – Operations",
    img: "https://wellnessbyheartfulness.com/wp-content/uploads/2026/04/BHARADWAJA-sirGM.webp",
  },
  {
    name: "Dr. Navaneeth CV",
    role: "Chief Medical Officer",
    img: "https://wellnessbyheartfulness.com/wp-content/uploads/2024/10/Dr-Navaneeth.jpg",
  },
  {
    name: "Dr. Jagruti K. Bhatt",
    role: "Senior Ayurveda Physician",
    img: "https://wellnessbyheartfulness.com/wp-content/uploads/2024/10/Dr-Jagruti.jpg",
  },
];

const Experts = () => (
  <section id="experts" className="py-24 sm:py-32 bg-[#EFECE6] border-y border-[#E2DDD5]" data-testid="experts-section">
    <div className="max-w-7xl mx-auto px-5 sm:px-8">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <SectionHead
          align="center"
          eyebrow="Our Experts"
          title={
            <>
              Guided by hands that <span className="italic text-[#A8833E]">have healed for decades</span>
            </>
          }
        />
        <Reveal delay={0.15}>
          <p className="mt-6 text-[#4A554D] leading-relaxed">
            Ayurveda doctors and practitioners from the Heartfulness Wellness team who shape your
            personal therapy programme.
          </p>
        </Reveal>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5" data-testid="experts-grid">
        {EXPERTS.map((e, i) => (
          <Reveal key={e.name} delay={0.07 * i}>
            <div className="group h-full rounded-2xl bg-white border border-[#E2DDD5] overflow-hidden transition-all duration-500 hover:border-[#C5A059]/60 hover:shadow-xl" data-testid={`expert-card-${i + 1}`}>
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={e.img}
                  alt={e.name}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131C18]/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-4 sm:p-5 text-center">
                <h3 className="font-display text-lg sm:text-xl text-[#1A2421] leading-tight">{e.name}</h3>
                <p className="mt-1.5 text-[0.7rem] tracking-[0.18em] uppercase text-[#A8833E] font-semibold">{e.role}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export default Experts;
