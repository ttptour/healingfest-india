import { MARQUEE_ITEMS } from "./data";

const Marquee = () => {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="border-y border-[#E2DDD5] bg-[#EFECE6] py-5 overflow-hidden" data-testid="marquee-strip">
      <div className="marquee-track items-center">
        {items.map((item, i) => (
          <span key={i} className="flex items-center shrink-0" aria-hidden={i >= MARQUEE_ITEMS.length}>
            <span className="font-display text-lg sm:text-xl italic text-[#2C3E35] px-8 whitespace-nowrap">
              {item}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#C5A059]" aria-hidden="true" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
