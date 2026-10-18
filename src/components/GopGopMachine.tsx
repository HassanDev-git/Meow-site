import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Gauge, Hand, Heart, PartyPopper } from "lucide-react";
import { audio } from "../lib/audio";
import { SectionHeading } from "./MeowBoard";

const MILESTONES = [
  { at: 25, label: "biscuit intern" },
  { at: 100, label: "certified kneader" },
  { at: 250, label: "gop wizard" },
  { at: 500, label: "deputy bakery chief" },
  { at: 1000, label: "THE GOPENING" },
];

function PawSprite({ side, hit }: { side: "l" | "r"; hit: boolean }) {
  return (
    <motion.svg
      viewBox="0 0 120 130"
      className="w-24 sm:w-32"
      animate={hit ? { y: 26, scaleY: 0.88 } : { y: 0, scaleY: 1 }}
      transition={{ type: "spring", stiffness: 900, damping: 22 }}
      style={{ transformOrigin: "50% 100%", scaleX: side === "r" ? -1 : 1 }}
    >
      {/* arm */}
      <rect x="46" y="0" width="28" height="46" rx="12" fill="#ffae52" stroke="#2b2118" strokeWidth="5" />
      {/* paw underside */}
      <g stroke="#2b2118" strokeWidth="5">
        <ellipse cx="60" cy="92" rx="34" ry="28" fill="#ffe3b3" />
        <ellipse cx="60" cy="100" rx="15" ry="11" fill="#ff9ec7" />
        <circle cx="36" cy="74" r="7.5" fill="#ff9ec7" />
        <circle cx="60" cy="66" r="7.5" fill="#ff9ec7" />
        <circle cx="84" cy="74" r="7.5" fill="#ff9ec7" />
      </g>
    </motion.svg>
  );
}

export default function GopGopMachine() {
  const [gops, setGops] = useState(0);
  const [cps, setCps] = useState(0);
  const [holding, setHolding] = useState(false);
  const [stamps, setStamps] = useState<{ l: number; r: number }>({ l: 0, r: 0 });
  const [toast, setToast] = useState<string | null>(null);
  const [, forceTick] = useState(0);

  const holdingRef = useRef(false);
  const intervalRef = useRef<number | null>(null);
  const stampsRef = useRef<number[]>([]);
  const reachedRef = useRef<Set<number>>(new Set());
  const pawRef = useRef<"l" | "r">("l");
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audioEl = new Audio("/gopgopgop.mp3");
    audioEl.loop = true;
    audioEl.preload = "auto";
    audioElRef.current = audioEl;

    return () => {
      audioEl.pause();
      audioEl.currentTime = 0;
    };
  }, []);

  const registerGop = useCallback(() => {
    const hitting = pawRef.current;
    pawRef.current = hitting === "l" ? "r" : "l";
    const now = Date.now();
    setStamps((s) => ({ ...s, [hitting]: now }));
    window.setTimeout(() => forceTick((n) => n + 1), 170);
    stampsRef.current.push(now);
    setGops((g) => {
      const next = g + 1;
      for (const m of MILESTONES) {
        if (next === m.at && !reachedRef.current.has(m.at)) {
          reachedRef.current.add(m.at);
          setToast(m.label);
          audio.meow("opera", 500);
          window.setTimeout(() => setToast(null), 2600);
        }
      }
      return next;
    });
  }, []);

  const start = useCallback(() => {
    if (holdingRef.current) return;
    holdingRef.current = true;
    setHolding(true);
    registerGop();

    if (audioElRef.current) {
      audioElRef.current.muted = audio.muted;
      audioElRef.current.currentTime = 0;
      audioElRef.current.play().catch(() => {});
    }

    intervalRef.current = window.setInterval(registerGop, 135);
  }, [registerGop]);

  const stop = useCallback(() => {
    holdingRef.current = false;
    setHolding(false);
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = null;

    if (audioElRef.current) {
      audioElRef.current.pause();
      audioElRef.current.currentTime = 0;
    }
  }, []);

  useEffect(() => {
    if (!holding) return;
    const handleGlobalPointerUp = () => stop();
    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);
    return () => {
      window.removeEventListener("pointerup", handleGlobalPointerUp);
      window.removeEventListener("pointercancel", handleGlobalPointerUp);
    };
  }, [holding, stop]);

  useEffect(() => stop, [stop]);

  /* cps meter */
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      stampsRef.current = stampsRef.current.filter((t) => now - t < 1000);
      setCps(stampsRef.current.length);
    }, 150);
    return () => window.clearInterval(id);
  }, []);

  const nextMilestone = MILESTONES.find((m) => m.at > gops);
  const progress = nextMilestone
    ? (gops / nextMilestone.at) * 100
    : 100;

  const pawHit = (side: "l" | "r") => {
    const mine = stamps[side];
    const other = side === "l" ? stamps.r : stamps.l;
    if (holding) return mine >= other;
    return Date.now() - mine < 170;
  };

  return (
    <section id="gopgop" className="relative overflow-hidden px-4 py-24 sm:px-8 sm:py-32">
      {/* diagonal backdrop strip */}
      <div className="absolute inset-x-0 top-1/2 h-[420px] -translate-y-1/2 -rotate-2 border-y-[3px] border-ink bg-mint/40" aria-hidden />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          kicker="instrument no. 02"
          title={
            <>
              GOP GOP <span className="text-outline">MACHINE</span>
            </>
          }
          sub="press & hold. the paws do the rest. scientists remain baffled."
        />

        <div className="grid items-stretch gap-8 lg:grid-cols-[1fr_1.2fr]">
          {/* stats panel */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            className="sticker shadow-hard-lg flex flex-col justify-between gap-8 rounded-3xl p-7 sm:p-9"
          >
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-ink/50">
                <Hand className="size-4" strokeWidth={2.5} /> lifetime gops
              </p>
              <p className="mt-2 font-display text-[clamp(3rem,7vw,5rem)] font-900 leading-none tabular-nums">
                {gops.toLocaleString()}
              </p>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/50">
                <span className="flex items-center gap-1.5">
                  <Gauge className="size-4" strokeWidth={2.5} /> gops / sec
                </span>
                <span className="tabular-nums text-ink">{cps.toFixed(0)}</span>
              </div>
              <div className="h-5 overflow-hidden rounded-full border-[3px] border-ink bg-cream-deep">
                <div
                  className="h-full rounded-full bg-coral transition-[width] duration-150"
                  style={{ width: `${Math.min(100, (cps / 9) * 100)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-ink/50">
                <span>
                  {nextMilestone
                    ? `next rank: ${nextMilestone.label}`
                    : "max rank achieved"}
                </span>
                <span className="tabular-nums text-ink">
                  {nextMilestone ? `${gops}/${nextMilestone.at}` : "∞"}
                </span>
              </div>
              <div className="h-5 overflow-hidden rounded-full border-[3px] border-ink bg-cream-deep">
                <div
                  className="h-full rounded-full bg-butter transition-[width] duration-200"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {MILESTONES.map((m) => (
                <span
                  key={m.at}
                  className={`flex items-center gap-1.5 rounded-full border-2 border-ink px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide ${
                    gops >= m.at ? "bg-butter" : "bg-cream-deep/50 opacity-50"
                  }`}
                >
                  <Award className="size-3.5" strokeWidth={2.5} />
                  {m.label}
                </span>
              ))}
            </div>
          </motion.div>

          {/* the machine */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ type: "spring", stiffness: 80, damping: 16 }}
            className="relative"
          >
            <div
              onPointerDown={start}
              onPointerUp={stop}
              onPointerLeave={stop}
              onPointerCancel={stop}
              onContextMenu={(e) => e.preventDefault()}
              className="shadow-hard-lg relative flex h-full min-h-[420px] cursor-pointer select-none flex-col overflow-hidden rounded-3xl border-[3px] border-ink bg-butter touch-none"
            >
              {/* toast */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    key={toast}
                    initial={{ y: -70, opacity: 0, rotate: -4 }}
                    animate={{ y: 0, opacity: 1, rotate: 0 }}
                    exit={{ y: -70, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="sticker shadow-hard absolute left-1/2 top-6 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-2xl px-5 py-3"
                  >
                    <PartyPopper className="size-5 text-coral" strokeWidth={2.5} />
                    <span className="font-display text-sm font-800 uppercase tracking-wide">
                      rank up: {toast}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* machine face */}
              <div className="relative flex flex-1 flex-col items-center justify-end pb-0 pt-14">
                <div className="mb-3 flex items-center gap-6 sm:gap-10" style={{ minHeight: 150 }}>
                  <PawSprite side="l" hit={pawHit("l")} />
                  <PawSprite side="r" hit={pawHit("r")} />
                </div>

                {/* dough */}
                <motion.div
                  animate={{ scaleX: holding ? [1, 1.05, 1] : 1, scaleY: holding ? [1, 0.94, 1] : 1 }}
                  transition={{ duration: 0.27, repeat: holding ? Infinity : 0 }}
                  className="relative z-0 -mb-1 h-16 w-[78%] rounded-t-[3rem] border-[3px] border-b-0 border-ink bg-blush sm:h-20"
                >
                  <Heart className="absolute left-1/2 top-1/2 size-6 -translate-x-1/2 -translate-y-1/2 text-cream" fill="currentColor" strokeWidth={0} />
                </motion.div>
                <div className="relative z-10 h-4 w-full border-t-[3px] border-ink bg-ink" />
              </div>

              {/* big press button */}
              <button
                onPointerDown={start}
                onPointerUp={stop}
                onPointerLeave={stop}
                onPointerCancel={stop}
                onContextMenu={(e) => e.preventDefault()}
                className={`relative z-20 select-none border-t-[3px] border-ink py-6 font-display text-lg font-900 uppercase tracking-[0.2em] transition-colors touch-none sm:text-xl ${
                  holding ? "bg-coral text-cream" : "bg-cream hover:bg-cream-deep"
                }`}
              >
                {holding ? "GOP GOP GOP GOP" : "press & hold to gop"}
              </button>
            </div>

            {/* shadow plate */}
            <div className="absolute -bottom-3 -right-3 -z-10 h-full w-full rounded-3xl border-[3px] border-ink bg-ink/5" aria-hidden />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
