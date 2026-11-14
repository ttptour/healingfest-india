import { LotusMark, scrollToId } from "./shared";
import { EVENT } from "./data";

const LINKS = [
  ["Overview", "#overview"],
  ["Pillars", "#pillars"],
  ["Healing", "#healing"],
  ["Schedule", "#schedule"],
  ["Venue", "#venue"],
  ["Enquire", "#enquire"],
];

const Footer = () => (
  <footer className="bg-[#131C18] border-t border-[#C5A059]/20 pt-20 pb-10 relative overflow-hidden" data-testid="footer-section">
    <div className="max-w-7xl mx-auto px-5 sm:px-8 relative">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3">
            <LotusMark size={34} />
            <span className="font-display text-2xl text-[#F8F5F0]">International Healing Retreat</span>
          </div>
          <p className="mt-5 max-w-sm text-[0.92rem] text-[#B9C2BB] leading-relaxed">
            {EVENT.tagline} — a six-day journey of Yoga, Ayurveda, Culture & Stillness at Kanha
            Shanti Vanam, Hyderabad.
          </p>
          <span className="mt-6 inline-block rounded-full border border-[#C5A059]/50 px-4 py-2 text-[0.7rem] tracking-[0.25em] uppercase text-[#E8CB96]" data-testid="footer-registrations-badge">
            Registrations Open · Feb 2027
          </span>
        </div>

        <div className="md:col-span-3">
          <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[#7A877E]">Explore</p>
          <ul className="mt-4 space-y-2.5">
            {LINKS.map(([label, id]) => (
              <li key={id}>
                <button
                  onClick={() => scrollToId(id)}
                  className="text-[0.92rem] text-[#B9C2BB] hover:text-[#E8CB96] transition-colors"
                  data-testid={`footer-link-${label.toLowerCase()}`}
                >
                  {label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[#7A877E]">Contact</p>
          <ul className="mt-4 space-y-3 text-[0.92rem] text-[#B9C2BB]">
            <li>
              <a href={`mailto:${EVENT.email}`} className="hover:text-[#E8CB96] transition-colors" data-testid="footer-email-link">
                {EVENT.email}
              </a>
            </li>
            <li data-testid="footer-organiser-address">{EVENT.organiser}</li>
            <li>{EVENT.dates}</li>
          </ul>
        </div>
      </div>

      <div className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#F8F5F0]/10 pt-7">
        <p className="text-[0.78rem] text-[#7A877E]">© 2026 International Healing Retreat. All rights reserved.</p>
        <p className="font-display italic text-[0.9rem] text-[#C5A059]/80">United by healing, inspired by love.</p>
      </div>
    </div>

    <span
      className="font-display absolute -bottom-10 left-1/2 -translate-x-1/2 text-[16vw] leading-none text-[#F8F5F0]/[0.03] italic select-none pointer-events-none whitespace-nowrap"
      aria-hidden="true"
    >
      come home
    </span>
  </footer>
);

export default Footer;
