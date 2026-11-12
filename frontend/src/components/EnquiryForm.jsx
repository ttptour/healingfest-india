import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { Reveal, SectionHead } from "./shared";
import { EVENT, FORM_OPTIONS } from "./data";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initial = {
  full_name: "",
  email: "",
  country: "",
  phone: "",
  participants: "",
  room_preference: "",
  preferred_date: FORM_OPTIONS.date[0],
  special_requests: "",
  agree: false,
};

const EnquiryForm = () => {
  const [form, setForm] = useState(initial);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value });

  const validate = () => {
    const er = {};
    if (form.full_name.trim().length < 2) er.full_name = "Please enter your full name";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) er.email = "Please enter a valid email address";
    if (form.country.trim().length < 2) er.country = "Please enter your country";
    if (!form.participants) er.participants = "Please select";
    if (!form.room_preference) er.room_preference = "Please select";
    if (!form.agree) er.agree = "Please agree so we can contact you";
    setErrors(er);
    return Object.keys(er).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSending(true);
    try {
      const { agree, ...payload } = form;
      await axios.post(`${API}/enquiries`, payload, { timeout: 20000 });
      toast.success("Enquiry received — we will reach out shortly with availability and pricing.");
      setForm(initial);
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const err = (k) =>
    errors[k] ? <p className="mt-1.5 text-xs text-[#9E5A3C]" data-testid={`error-${k}`}>{errors[k]}</p> : null;

  return (
    <section id="enquire" className="py-24 sm:py-32 bg-[#131C18] relative overflow-hidden" data-testid="enquiry-form-section">
      <span
        className="font-display absolute top-10 left-1/2 -translate-x-1/2 text-[18vw] leading-none text-[#F8F5F0]/[0.035] italic select-none pointer-events-none whitespace-nowrap"
        aria-hidden="true"
      >
        enquiries
      </span>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHead
            dark
            eyebrow="Registrations Open"
            title={
              <>
                Request availability <span className="italic text-[#E8CB96]">& pricing</span>
              </>
            }
          />
          <Reveal delay={0.15}>
            <p className="mt-6 text-[#B9C2BB] leading-relaxed">
              Complete the registration form to request availability, programme details and
              package pricing for {EVENT.dates}.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-10 space-y-5 border-t border-[#C5A059]/20 pt-8" data-testid="enquiry-contact-info">
              <div>
                <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[#7A877E]">Email</p>
                <a href={`mailto:${EVENT.email}`} className="mt-1 block text-[#F8F5F0] hover:text-[#E8CB96] transition-colors" data-testid="contact-email-link">
                  {EVENT.email}
                </a>
              </div>
              <div>
                <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[#7A877E]">Website</p>
                <span className="mt-1 block text-[#F8F5F0]">{EVENT.site}</span>
              </div>
              <div>
                <p className="text-[0.7rem] tracking-[0.25em] uppercase text-[#7A877E]">Venue</p>
                <span className="mt-1 block text-[#F8F5F0]">{EVENT.venue}</span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.2} className="lg:col-span-7">
          <form
            onSubmit={submit}
            noValidate
            className="rounded-2xl bg-[#F8F5F0] p-7 sm:p-10 border border-[#C5A059]/30 shadow-2xl"
            data-testid="enquiry-form"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="field-label" htmlFor="f-name">Full name *</label>
                <input id="f-name" className="field" placeholder="Enter your full name" value={form.full_name} onChange={set("full_name")} data-testid="enquiry-fullname-input" />
                {err("full_name")}
              </div>
              <div>
                <label className="field-label" htmlFor="f-email">Email address *</label>
                <input id="f-email" type="email" className="field" placeholder="Enter your email address" value={form.email} onChange={set("email")} data-testid="enquiry-email-input" />
                {err("email")}
              </div>
              <div>
                <label className="field-label" htmlFor="f-country">Country *</label>
                <input id="f-country" className="field" placeholder="Enter your country" value={form.country} onChange={set("country")} data-testid="enquiry-country-input" />
                {err("country")}
              </div>
              <div>
                <label className="field-label" htmlFor="f-phone">Phone / WhatsApp</label>
                <input id="f-phone" className="field" placeholder="Enter your phone or WhatsApp" value={form.phone} onChange={set("phone")} data-testid="enquiry-phone-input" />
              </div>
              <div>
                <label className="field-label" htmlFor="f-participants">Participants *</label>
                <select id="f-participants" className="field" value={form.participants} onChange={set("participants")} data-testid="enquiry-participants-select">
                  <option value="">Select participants</option>
                  {FORM_OPTIONS.participants.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                {err("participants")}
              </div>
              <div>
                <label className="field-label" htmlFor="f-room">Room preference *</label>
                <select id="f-room" className="field" value={form.room_preference} onChange={set("room_preference")} data-testid="enquiry-room-select">
                  <option value="">Select room preference</option>
                  {FORM_OPTIONS.room.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
                {err("room_preference")}
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="f-date">Preferred retreat date</label>
                <select id="f-date" className="field" value={form.preferred_date} onChange={set("preferred_date")} data-testid="enquiry-date-select">
                  {FORM_OPTIONS.date.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="field-label" htmlFor="f-requests">Special requests or questions</label>
                <textarea id="f-requests" rows="4" className="field resize-none" placeholder="Any special requests or questions?" value={form.special_requests} onChange={set("special_requests")} data-testid="enquiry-requests-textarea" />
              </div>
            </div>

            <label className="mt-6 flex items-start gap-3 cursor-pointer" data-testid="enquiry-agree-label">
              <input type="checkbox" checked={form.agree} onChange={set("agree")} className="mt-1 h-4 w-4 accent-[#C5A059]" data-testid="enquiry-agree-checkbox" />
              <span className="text-[0.85rem] text-[#4A554D]">
                I agree to be contacted regarding my retreat enquiry. *
              </span>
            </label>
            {err("agree")}

            <motion.button
              whileHover={{ scale: sending ? 1 : 1.02 }}
              whileTap={{ scale: sending ? 1 : 0.98 }}
              type="submit"
              disabled={sending}
              className="mt-8 w-full sm:w-auto rounded-full bg-[#131C18] px-10 py-4 text-[0.88rem] font-semibold tracking-wide text-[#F8F5F0] transition-colors duration-300 hover:bg-[#C5A059] hover:text-[#131C18] disabled:opacity-60"
              data-testid="enquiry-submit-btn"
            >
              {sending ? "Sending…" : "Request availability & pricing"}
            </motion.button>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default EnquiryForm;
