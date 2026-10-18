import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { PawPrint } from "lucide-react";

export default function CustomCursor() {
  const [down, setDown] = useState(false);
  const [fine, setFine] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 35, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 500, damping: 35, mass: 0.6 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    setFine(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!fine) return;
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const dn = () => setDown(true);
    const up = () => setDown(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", dn);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", dn);
      window.removeEventListener("mouseup", up);
    };
  }, [fine, x, y]);

  if (!fine) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[95]"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        animate={{ scale: down ? 0.7 : 1, rotate: down ? -18 : 0 }}
        transition={{ type: "spring", stiffness: 700, damping: 24 }}
        className="-translate-x-1/2 -translate-y-1/2"
      >
        <span className="grid size-9 place-items-center rounded-full border-[2.5px] border-ink bg-coral/90 shadow-[2px_2px_0_#2b2118]">
          <PawPrint className="size-5 text-cream" strokeWidth={2.4} />
        </span>
      </motion.div>
    </motion.div>
  );
}
