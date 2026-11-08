import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MeowBoard from "./components/MeowBoard";
import GopGopMachine from "./components/GopGopMachine";
import MeowDictionary from "./components/MeowDictionary";
import Footer from "./components/Footer";
import HireMePopup from "./components/HireMePopup";

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 1500);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.15, anchors: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <AnimatePresence>{loading && <Preloader />}</AnimatePresence>

      <CustomCursor />
      <div className="grain" aria-hidden />

      <Navbar />

      <main>
        <Hero />
        <MeowBoard />
        <GopGopMachine />
        <MeowDictionary />
      </main>

      <Footer />
      <HireMePopup />
    </div>
  );
}
