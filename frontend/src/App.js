import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Lenis from "lenis";
import { Toaster } from "@/components/ui/sonner";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Intro from "./components/Intro";
import Pillars from "./components/Pillars";
import HealingDays from "./components/HealingDays";
import Heartfulness from "./components/Heartfulness";
import Schedule from "./components/Schedule";
import Experts from "./components/Experts";
import Venue from "./components/Venue";
import EnquiryForm from "./components/EnquiryForm";
import Footer from "./components/Footer";
import AdminInbox from "./pages/AdminInbox";

const Landing = () => (
  <>
    <Nav />
    <main>
      <Hero />
      <Marquee />
      <Intro />
      <Pillars />
      <HealingDays />
      <Heartfulness />
      <Schedule />
      <Venue />
      <Experts />
      <EnquiryForm />
    </main>
    <Footer />
  </>
);

function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    window.__lenis = lenis;
    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      window.__lenis = null;
    };
  }, []);

  return (
    <div className="grain bg-[#F8F5F0] text-[#1A2421] antialiased">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/admin/enquiries" element={<AdminInbox />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="bottom-right" richColors />
    </div>
  );
}

export default App;
