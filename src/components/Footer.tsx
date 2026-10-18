import { useState } from "react";
import { motion } from "framer-motion";
import { Cat, Heart, PawPrint } from "lucide-react";
import { audio } from "../lib/audio";
import Marquee from "./Marquee";

export default function Footer() {
  const [boops, setBoops] = useState(0);

  const boop = () => {
    audio.meow(["meow", "nya", "trill"][boops % 3] as "meow" | "nya" | "trill", 480);
    setBoops((b) => b + 1);
  };

  return (
    <footer className="relative overflow-hidden">
      {/* top marquee */}
      <div className="rotate-1 scale-[1.02] border-y-[3px] border-ink bg-butter py-3">
        <Marquee
          duration={18}
          reverse
          items={Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="flex items-center">
              {["adopt the gop", "•", "practice daily", "•", "knead responsibly", "•"].map(
                (w, j) => (
                  <span key={j} className="mx-4 font-display text-base font-800 uppercase tracking-wide">
                    {w}
                  </span>
                )
              )}
            </span>
          ))}
        />
      </div>

      {/* CTA */}
      <div className="noise-bg relative bg-ink px-4 py-20 text-center text-cream sm:py-28">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
          className="font-display text-[clamp(2.4rem,8vw,6rem)] font-900 leading-[0.95] tracking-tight"
        >
          GO FORTH
          <br />
          <span className="text-outline-cream">&</span>{" "}
          <span className="text-coral">GOP</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="font-hand mx-auto mt-5 max-w-md text-2xl text-cream/60"
        >
          may your biscuits be endless and your meows forever synthesized
        </motion.p>

        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.2 }}
          onClick={boop}
          className="mx-auto mt-10 flex items-center gap-3 rounded-2xl border-[3px] border-cream bg-coral px-8 py-4 font-display text-base font-800 text-cream shadow-[6px_6px_0_#fff3e2]"
        >
          <PawPrint className="size-5" strokeWidth={2.5} />
          {boops === 0 ? "ONE LAST MEOW" : `MEOWED x${boops}`}
        </motion.button>
      </div>

      {/* credits */}
      <div className="flex flex-col items-center justify-between gap-4 border-t-[3px] border-cream/15 bg-ink px-6 py-6 text-cream/50 sm:flex-row sm:px-10">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <span className="grid size-7 place-items-center rounded-lg border-2 border-cream/30 bg-coral">
            <PawPrint className="size-4 text-cream" strokeWidth={2.5} />
          </span>
          Meow-Gop atelier — est. 2025
        </p>
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest">
          made with <Heart className="size-3.5 fill-coral text-coral" /> zero purrmissions
        </p>
        <a
          href="#top"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-cream/70 transition-colors hover:text-cream"
        >
          <Cat className="size-4" strokeWidth={2.5} />
          back to the cat
        </a>
      </div>
    </footer>
  );
}
