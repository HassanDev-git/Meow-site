import { motion } from "framer-motion";
import { ArrowDown, MousePointerClick, Sparkles } from "lucide-react";
import CatFace from "./CatFace";
import Marquee from "./Marquee";
import { audio } from "../lib/audio";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 1.7 } },
};
const item = {
  hidden: { y: 40, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 90, damping: 16 },
  },
};

function RotatingBadge() {
  return (
    <div className="anim-spin-slow absolute -left-3 -top-4 z-20 hidden size-28 sm:block lg:-left-8 lg:size-32">
      <svg viewBox="0 0 100 100" className="size-full">
        <defs>
          <path id="circ" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
        </defs>
        <circle cx="50" cy="50" r="49" fill="#ffc53d" stroke="#2b2118" strokeWidth="2.5" />
        <text fontSize="10.2" fontWeight="700" letterSpacing="2.6" fill="#2b2118">
          <textPath href="#circ">• MEOW ATELIER • GOP GOP • EST 2025</textPath>
        </text>
        <g transform="translate(50 50)">
          <ellipse cx="0" cy="4" rx="9" ry="7" fill="#2b2118" />
          <circle cx="-6.5" cy="-5" r="3.4" fill="#2b2118" />
          <circle cx="0" cy="-7.5" r="3.4" fill="#2b2118" />
          <circle cx="6.5" cy="-5" r="3.4" fill="#2b2118" />
        </g>
      </svg>
    </div>
  );
}

export default function Hero() {
  return (
    <section id="top" className="noise-bg relative overflow-hidden pb-0 pt-28 sm:pt-32">
      {/* faint background paw dots */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden>
        <svg className="absolute left-[6%] top-[18%] size-16 -rotate-12 text-blush" viewBox="0 0 32 32" fill="currentColor"><ellipse cx="16" cy="20" rx="8" ry="6.5" /><circle cx="7.5" cy="11.5" r="3.2" /><circle cx="16" cy="9" r="3.2" /><circle cx="24.5" cy="11.5" r="3.2" /></svg>
        <svg className="absolute right-[8%] top-[12%] size-12 rotate-12 text-mint" viewBox="0 0 32 32" fill="currentColor"><ellipse cx="16" cy="20" rx="8" ry="6.5" /><circle cx="7.5" cy="11.5" r="3.2" /><circle cx="16" cy="9" r="3.2" /><circle cx="24.5" cy="11.5" r="3.2" /></svg>
        <svg className="absolute bottom-[30%] left-[3%] size-10 rotate-45 text-sky" viewBox="0 0 32 32" fill="currentColor"><ellipse cx="16" cy="20" rx="8" ry="6.5" /><circle cx="7.5" cy="11.5" r="3.2" /><circle cx="16" cy="9" r="3.2" /><circle cx="24.5" cy="11.5" r="3.2" /></svg>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_1fr] lg:gap-4"
      >
        {/* left: type */}
        <div className="relative z-10 text-center lg:text-left">
          <motion.p
            variants={item}
            className="mb-4 inline-flex items-center gap-2 rounded-full border-[3px] border-ink bg-mint px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] shadow-hard-sm"
          >
            <Sparkles className="size-3.5" strokeWidth={2.5} />
            the feline sound atelier
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(3.2rem,10vw,7.5rem)] font-900 leading-[0.92] tracking-tight"
          >
            MEOW,
            <br />
            <span className="text-outline">GOP</span>{" "}
            <span className="relative inline-block text-coral">
              GOP
              <span className="font-hand absolute -right-6 -top-5 rotate-12 text-2xl font-normal text-ink sm:-right-10 sm:text-3xl">
                x2!
              </span>
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-md text-base font-medium text-ink/70 sm:text-lg lg:mx-0"
          >
            An interactive shrine to the two most important sounds on earth.
            Boop the cat, compose on the meow board, and knead your way to
            glory. <span className="font-hand text-xl text-coral">no treats required.</span>
          </motion.p>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start"
          >
            <a
              href="#board"
              onClick={() => audio.gop(0.8)}
              className="shadow-hard group inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-coral px-6 py-3.5 font-display text-sm font-700 text-cream transition-all hover:-translate-y-1 hover:shadow-hard-lg active:translate-y-0 active:shadow-hard-none"
            >
              <MousePointerClick className="size-4 transition-transform group-hover:rotate-12" strokeWidth={2.5} />
              PLAY THE MEOWS
            </a>
            <a
              href="#gopgop"
              onClick={() => audio.gop(0.5)}
              className="shadow-hard inline-flex items-center gap-2 rounded-2xl border-[3px] border-ink bg-cream px-6 py-3.5 font-display text-sm font-700 transition-all hover:-translate-y-1 hover:shadow-hard-lg active:translate-y-0 active:shadow-hard-none"
            >
              GOP GOP ME
              <ArrowDown className="size-4" strokeWidth={2.5} />
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-9 flex flex-wrap justify-center gap-x-8 gap-y-3 lg:justify-start"
          >
            {[
              ["12,408", "meows synthesized"],
              ["∞", "gops per session"],
              ["0", "cats compensated"],
            ].map(([n, l]) => (
              <div key={l} className="text-center lg:text-left">
                <p className="font-display text-2xl font-800 tabular-nums">{n}</p>
                <p className="text-xs font-semibold uppercase tracking-widest text-ink/50">
                  {l}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* right: cat stage */}
        <motion.div variants={item} className="relative mx-auto w-full max-w-[560px]">
          <RotatingBadge />

          {/* stage circle */}
          <div className="relative">
            <div className="absolute inset-[6%] rounded-full border-[3px] border-ink bg-butter shadow-hard-lg" />
            {/* sonar rings */}
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="absolute inset-[6%] rounded-full border-[3px] border-coral"
                style={{
                  animation: `ring-pulse 2.8s ease-out ${i * 0.9}s infinite`,
                }}
              />
            ))}
            {/* dashed orbit */}
            <svg className="anim-spin-slow absolute -inset-3 opacity-60" viewBox="0 0 100 100" style={{ animationDuration: "26s" }}>
              <circle cx="50" cy="50" r="49" fill="none" stroke="#2b2118" strokeWidth="0.8" strokeDasharray="3 4" strokeLinecap="round" />
            </svg>
            <div className="relative z-10 px-4 pb-2 pt-10 sm:px-8">
              <CatFace />
            </div>

            {/* floating chips */}
            <div className="anim-floaty sticker shadow-hard-sm absolute -right-2 top-1/4 z-20 hidden rotate-6 rounded-xl px-3 py-2 sm:block" style={{ "--rot": "6deg" } as React.CSSProperties}>
              <p className="font-hand text-lg leading-none">boop me ↑</p>
            </div>
            <div className="anim-floaty sticker shadow-hard-sm absolute -left-4 bottom-1/4 z-20 hidden -rotate-6 rounded-xl px-3 py-2 sm:block" style={{ "--rot": "-6deg", animationDelay: "1.2s" } as React.CSSProperties}>
              <p className="font-hand text-lg leading-none">100% organic purrs</p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* bottom marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
        className="mt-14 -rotate-1 border-y-[3px] border-ink bg-coral py-3 text-cream"
      >
        <Marquee
          duration={20}
          items={Array.from({ length: 6 }, (_, i) => (
            <span key={i} className="flex items-center">
              {["MEOW", "GOP GOP", "MRRP?!", "NYA", "PURRRR", "MEEOOOW"].map(
                (w, j) => (
                  <span key={j} className="flex items-center">
                    <span className={`mx-5 font-display text-lg font-800 tracking-wide ${j % 2 ? "text-outline-cream" : ""}`}>
                      {w}
                    </span>
                    <svg viewBox="0 0 32 32" className="size-5 fill-cream"><ellipse cx="16" cy="20" rx="8" ry="6.5" /><circle cx="7.5" cy="11.5" r="3.2" /><circle cx="16" cy="9" r="3.2" /><circle cx="24.5" cy="11.5" r="3.2" /></svg>
                  </span>
                )
              )}
            </span>
          ))}
        />
      </motion.div>
    </section>
  );
}
