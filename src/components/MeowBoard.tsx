import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Disc3, Pause, Play, RotateCcw } from "lucide-react";
import { audio, type MeowKind } from "../lib/audio";

/* ---------------- pads ---------------- */

const SCALES = [392, 440, 494, 587, 659, 784, 880, 988];
const PAD_KINDS: MeowKind[] = ["meow", "nya", "meow", "trill", "nya", "meow", "opera", "trill"];
const PAD_COLORS = ["#ff5d5d", "#ffc53d", "#54d1b2", "#7fb5ff", "#ff9ec7", "#ff5d5d", "#ffc53d", "#54d1b2"];
const PAD_KEYS = ["1", "2", "3", "4", "5", "6", "7", "8"];

/* ---------------- sequencer ---------------- */

const STEPS = 16;
const TRACKS = [
  { label: "GOP", color: "#ff5d5d", play: () => audio.gop(1) },
  { label: "MEOW", color: "#ffc53d", play: () => audio.meow("nya", 620) },
  { label: "TK", color: "#54d1b2", play: () => audio.tick() },
];

const DEFAULT_PATTERN: boolean[][] = [
  [true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, true],
  [false, false, true, false, false, false, true, false, false, false, true, false, false, true, false, false],
  [false, true, false, true, false, true, false, true, false, true, false, true, true, false, true, false],
];

function SectionHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string;
  title: React.ReactNode;
  sub: string;
}) {
  return (
    <div className="mb-12 text-center">
      <span className="mb-4 inline-block rounded-full border-[3px] border-ink bg-blush px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] shadow-hard-sm">
        {kicker}
      </span>
      <h2 className="font-display text-[clamp(2rem,5.5vw,3.8rem)] font-900 leading-none tracking-tight">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl font-hand text-2xl text-ink/60">{sub}</p>
    </div>
  );
}

export { SectionHeading };

export default function MeowBoard() {
  const [pattern, setPattern] = useState<boolean[][]>(DEFAULT_PATTERN);
  const patternRef = useRef(pattern);
  patternRef.current = pattern;

  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [bpm, setBpm] = useState(124);
  const bpmRef = useRef(bpm);
  bpmRef.current = bpm;
  const stepRef = useRef(-1);
  const timerRef = useRef<number | null>(null);

  const [activePad, setActivePad] = useState<number | null>(null);

  const hitPad = useCallback((i: number, quiet = false) => {
    const pitch = SCALES[i] ?? 440;
    const kind = PAD_KINDS[i] ?? "meow";
    audio.meow(kind, pitch * 0.62);
    if (!quiet) {
      setActivePad(i);
      window.setTimeout(() => setActivePad(null), 220);
    }
  }, []);

  /* keyboard: 1-8 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return;
      const i = PAD_KEYS.indexOf(e.key);
      if (i >= 0) hitPad(i);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [hitPad]);

  const stop = useCallback(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = null;
    stepRef.current = -1;
    setStep(-1);
    setPlaying(false);
  }, []);

  const play = useCallback(() => {
    stop();
    setPlaying(true);
    const tickStep = () => {
      stepRef.current = (stepRef.current + 1) % STEPS;
      const s = stepRef.current;
      setStep(s);
      patternRef.current.forEach((row, t) => {
        if (row[s]) TRACKS[t]?.play();
      });
    };
    tickStep();
    timerRef.current = window.setInterval(tickStep, 60000 / bpmRef.current / 4);
  }, [stop]);

  /* restart interval when bpm changes while playing */
  useEffect(() => {
    if (playing && timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        stepRef.current = (stepRef.current + 1) % STEPS;
        const s = stepRef.current;
        setStep(s);
        patternRef.current.forEach((row, t) => {
          if (row[s]) TRACKS[t]?.play();
        });
      }, 60000 / bpmRef.current / 4);
    }
  }, [bpm, playing]);

  useEffect(() => stop, [stop]);

  const toggleCell = (t: number, s: number) => {
    setPattern((p) =>
      p.map((row, ti) => (ti === t ? row.map((v, si) => (si === s ? !v : v)) : row))
    );
  };

  return (
    <section id="board" className="relative px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <SectionHeading
          kicker="instrument no. 01"
          title={
            <>
              THE <span className="text-outline">MEOW</span> BOARD
            </>
          }
          sub="eight hand-tuned meows and a tiny rhythm machine. your cat already hates it."
        />

        {/* pads */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 80, damping: 16 }}
          className="sticker shadow-hard-lg rounded-3xl p-5 sm:p-8"
        >
          <div className="mb-5 flex items-center justify-between">
            <p className="font-display text-xs font-700 uppercase tracking-[0.25em] text-ink/60">
              live pads <span className="ms-2 hidden text-ink/40 sm:inline">— keys 1–8 work too</span>
            </p>
            <span className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-mint px-3 py-1 text-[11px] font-bold uppercase tracking-widest">
              <span className="size-1.5 animate-pulse rounded-full bg-ink" />
              armed
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3 sm:gap-4">
            {SCALES.map((_, i) => (
              <motion.button
                key={i}
                onPointerDown={() => hitPad(i)}
                animate={
                  activePad === i
                    ? { scale: 0.9, rotate: -2 }
                    : { scale: 1, rotate: 0 }
                }
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
                className="group relative aspect-square touch-none rounded-2xl border-[3px] border-ink shadow-hard-sm select-none"
                style={{ background: PAD_COLORS[i] }}
                aria-label={`Meow pad ${i + 1}`}
              >
                <span className="absolute left-2 top-1.5 font-display text-xs font-800 text-ink/50">
                  {PAD_KEYS[i]}
                </span>
                <span className="font-hand absolute inset-0 grid place-items-center text-2xl text-ink opacity-0 transition-opacity group-hover:opacity-100 sm:text-3xl">
                  {PAD_KINDS[i] === "trill" ? "mrrp" : PAD_KINDS[i] === "opera" ? "OOOW" : PAD_KINDS[i]}
                </span>
                {/* paw glyph */}
                <svg viewBox="0 0 32 32" className="absolute inset-0 m-auto size-9 fill-ink/70 transition-opacity group-hover:opacity-0 sm:size-11"><ellipse cx="16" cy="20" rx="8" ry="6.5" /><circle cx="7.5" cy="11.5" r="3.2" /><circle cx="16" cy="9" r="3.2" /><circle cx="24.5" cy="11.5" r="3.2" /></svg>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* sequencer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 80, damping: 16, delay: 0.1 }}
          className="sticker shadow-hard-lg mt-8 rounded-3xl p-5 sm:p-8"
        >
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <p className="font-display text-xs font-700 uppercase tracking-[0.25em] text-ink/60">
              the gop sequencer
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-xl border-2 border-ink bg-cream px-3 py-1.5">
                <Disc3 className={`size-4 ${playing ? "animate-spin" : ""}`} strokeWidth={2.5} />
                <input
                  type="range"
                  min={80}
                  max={170}
                  value={bpm}
                  onChange={(e) => setBpm(Number(e.target.value))}
                  className="h-1 w-24 accent-[#2b2118] sm:w-32"
                  aria-label="Tempo"
                />
                <span className="w-14 text-right font-display text-xs font-700 tabular-nums">
                  {bpm} BPM
                </span>
              </div>
              <button
                onClick={() => setPattern(DEFAULT_PATTERN)}
                aria-label="Reset pattern"
                className="shadow-hard-sm grid size-10 place-items-center rounded-xl border-[3px] border-ink bg-cream transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-hard-none"
              >
                <RotateCcw className="size-4" strokeWidth={2.5} />
              </button>
              <button
                onClick={playing ? stop : play}
                className="shadow-hard inline-flex items-center gap-2 rounded-xl border-[3px] border-ink bg-butter px-5 py-2.5 font-display text-sm font-800 transition-all hover:-translate-y-0.5 hover:shadow-hard-lg active:translate-y-0 active:shadow-hard-none"
              >
                {playing ? (
                  <Pause className="size-4 fill-ink" strokeWidth={2.5} />
                ) : (
                  <Play className="size-4 fill-ink" strokeWidth={2.5} />
                )}
                {playing ? "STOP" : "DROP IT"}
              </button>
            </div>
          </div>

          <div className="space-y-2.5">
            {TRACKS.map((track, t) => (
              <div key={track.label} className="flex items-center gap-3">
                <span
                  className="w-14 shrink-0 rounded-lg border-2 border-ink py-1 text-center font-display text-[11px] font-800"
                  style={{ background: track.color }}
                >
                  {track.label}
                </span>
                <div className="grid flex-1 grid-cols-8 gap-1.5 sm:grid-cols-16">
                  {pattern[t]?.map((on, s) => (
                    <button
                      key={s}
                      onClick={() => toggleCell(t, s)}
                      aria-label={`step ${s + 1} ${track.label}`}
                      className={`aspect-square rounded-md border-2 border-ink transition-all ${
                        s % 4 === 0 ? "rounded-lg" : ""
                      } ${on ? "" : "bg-cream-deep/60 hover:bg-cream-deep"}`}
                      style={{
                        background: on ? track.color : undefined,
                        transform:
                          step === s && playing ? "scale(1.18)" : undefined,
                        boxShadow:
                          step === s && playing
                            ? "0 0 0 2px #2b2118"
                            : on
                              ? "2px 2px 0 #2b2118"
                              : undefined,
                        transition: "transform 0.08s, box-shadow 0.08s, background 0.12s",
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-center font-hand text-xl text-ink/50">
            tap cells to plot your masterpiece — gops on the downbeat, always
          </p>
        </motion.div>
      </div>
    </section>
  );
}
