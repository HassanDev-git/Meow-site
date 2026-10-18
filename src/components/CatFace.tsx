import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { audio, type MeowKind } from "../lib/audio";

const BUBBLES = [
  "meow!",
  "gop gop",
  "mrrp?",
  "nya~",
  "MEOW!!",
  "purrrr…",
  "feed me.",
  "gop gop gop",
];

const PARTICLE_WORDS = ["meow", "gop", "nya", "mrrp", "mew", "gop gop", "purr"];

const KINDS: MeowKind[] = ["meow", "meow", "nya", "trill", "opera", "grumble"];

type Particle = {
  id: number;
  x: number;
  y: number;
  rot: number;
  text: string;
  color: string;
};

let pid = 0;

export default function CatFace() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [meowing, setMeowing] = useState(false);
  const [bubble, setBubble] = useState<{ text: string; k: number } | null>(null);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [kneadFast, setKneadFast] = useState(false);

  // eye tracking
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const eyeX = useSpring(rawX, { stiffness: 300, damping: 20 });
  const eyeY = useSpring(rawY, { stiffness: 300, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = Math.max(-1, Math.min(1, (e.clientX - cx) / (r.width * 0.9)));
      const dy = Math.max(-1, Math.min(1, (e.clientY - cy) / (r.height * 0.9)));
      rawX.set(dx * 9);
      rawY.set(dy * 7);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY]);

  const boop = useCallback(() => {
    const kind = KINDS[Math.floor(Math.random() * KINDS.length)] ?? "meow";
    audio.meow(kind, kind === "grumble" ? 300 : 430 + Math.random() * 160);
    setMeowing(true);
    setKneadFast(true);
    const text = BUBBLES[Math.floor(Math.random() * BUBBLES.length)] ?? "meow!";
    setBubble({ text, k: Date.now() });
    setParticles((ps) => [
      ...ps.slice(-10),
      ...Array.from({ length: 5 }, () => ({
        id: ++pid,
        x: (Math.random() - 0.5) * 340,
        y: -60 - Math.random() * 190,
        rot: (Math.random() - 0.5) * 70,
        text:
          PARTICLE_WORDS[Math.floor(Math.random() * PARTICLE_WORDS.length)] ??
          "mew",
        color: ["#ff5d5d", "#ffc53d", "#54d1b2", "#7fb5ff", "#ff9ec7"][
          Math.floor(Math.random() * 5)
        ] as string,
      })),
    ]);
    window.setTimeout(() => setMeowing(false), kind === "opera" ? 1250 : 620);
    window.setTimeout(() => setKneadFast(false), 1500);
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative select-none"
      style={
        {
          "--knead-dur": kneadFast ? "0.38s" : "2.6s",
        } as React.CSSProperties
      }
    >
      {/* speech bubble */}
      <AnimatePresence mode="wait">
        {bubble && (
          <motion.div
            key={bubble.k}
            initial={{ scale: 0, rotate: -14, y: 14, opacity: 0 }}
            animate={{ scale: 1, rotate: 4, y: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 22 }}
            className="sticker shadow-hard-sm absolute -top-6 right-0 z-20 rounded-2xl rounded-br-sm px-5 py-2.5 sm:-right-4"
          >
            <span className="font-hand text-3xl leading-none text-ink sm:text-4xl">
              {bubble.text}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* flying particles */}
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <AnimatePresence>
          {particles.map((p) => (
            <motion.span
              key={p.id}
              initial={{ x: 0, y: 60, opacity: 0, scale: 0.4, rotate: 0 }}
              animate={{
                x: p.x,
                y: p.y,
                opacity: [0, 1, 1, 0],
                scale: [0.4, 1.15, 1],
                rotate: p.rot,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              onAnimationComplete={() =>
                setParticles((ps) => ps.filter((q) => q.id !== p.id))
              }
              className="font-hand absolute text-2xl font-bold sm:text-3xl"
              style={{ color: p.color, textShadow: "2px 2px 0 #2b2118" }}
            >
              {p.text}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <motion.svg
        viewBox="0 0 480 470"
        className="w-full max-w-[540px]"
        onClick={boop}
        whileTap={{ scale: 0.97 }}
        role="button"
        aria-label="Boop the cat"
        animate={meowing ? { rotate: [0, -1.5, 1.5, 0], scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.5 }}
      >
        {/* ears */}
        <g stroke="#2b2118" strokeWidth="7" strokeLinejoin="round">
          <path d="M84 176 Q60 58 148 74 Q196 84 196 148 Z" fill="#ffae52" />
          <path d="M396 176 Q420 58 332 74 Q284 84 284 148 Z" fill="#ffae52" />
          <path
            d="M112 150 Q102 96 142 100 Q166 104 166 138 Z"
            fill="#ff9ec7"
            strokeWidth="5"
          />
          <path
            d="M368 150 Q378 96 338 100 Q314 104 314 138 Z"
            fill="#ff9ec7"
            strokeWidth="5"
          />
        </g>

        {/* head */}
        <ellipse
          cx="240"
          cy="252"
          rx="196"
          ry="164"
          fill="#ffae52"
          stroke="#2b2118"
          strokeWidth="7"
        />

        {/* forehead stripes */}
        <g stroke="#2b2118" strokeWidth="7" strokeLinecap="round">
          <path d="M216 96 Q214 122 218 140" fill="none" />
          <path d="M240 92 Q240 118 240 132" fill="none" />
          <path d="M264 96 Q266 122 262 140" fill="none" />
        </g>

        {/* cheek marks */}
        <g stroke="#2b2118" strokeWidth="5" strokeLinecap="round" opacity="0.55">
          <path d="M78 262 l26 -6" />
          <path d="M80 288 l26 2" />
          <path d="M402 262 l-26 -6" />
          <path d="M400 288 l-26 2" />
        </g>

        {/* blush */}
        <ellipse cx="120" cy="310" rx="26" ry="13" fill="#ff9ec7" opacity="0.7" />
        <ellipse cx="360" cy="310" rx="26" ry="13" fill="#ff9ec7" opacity="0.7" />

        {/* eyes */}
        {[168, 312].map((cx) => (
          <g key={cx}>
            <circle
              cx={cx}
              cy="228"
              r="34"
              fill="#fffdf8"
              stroke="#2b2118"
              strokeWidth="7"
            />
            <motion.g style={{ x: eyeX, y: eyeY }}>
              <circle cx={cx} cy="228" r="17" fill="#c9761f" />
              <circle cx={cx} cy="228" r="8" fill="#2b2118" />
              <circle cx={cx - 5} cy="222" r="4" fill="#fffdf8" />
            </motion.g>
          </g>
        ))}

        {/* muzzle */}
        <ellipse cx="240" cy="316" rx="72" ry="48" fill="#ffe3b3" />

        {/* nose */}
        <path
          d="M226 288 Q240 280 254 288 Q250 304 240 306 Q230 304 226 288 Z"
          fill="#ff5d5d"
          stroke="#2b2118"
          strokeWidth="5"
          strokeLinejoin="round"
        />

        {/* mouth: closed :3 */}
        <motion.g
          animate={{ opacity: meowing ? 0 : 1 }}
          transition={{ duration: 0.08 }}
          stroke="#2b2118"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        >
          <path d="M240 308 Q240 322 222 320" />
          <path d="M240 308 Q240 322 258 320" />
        </motion.g>

        {/* mouth: open meow */}
        <motion.g
          style={{ transformOrigin: "240px 318px", transformBox: "view-box" }}
          animate={{ scale: meowing ? 1 : 0.2, opacity: meowing ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 24 }}
        >
          <ellipse
            cx="240"
            cy="326"
            rx="26"
            ry="20"
            fill="#5b2b1e"
            stroke="#2b2118"
            strokeWidth="5"
          />
          <ellipse cx="240" cy="334" rx="14" ry="9" fill="#ff5d5d" />
        </motion.g>

        {/* whiskers */}
        <g
          stroke="#2b2118"
          strokeWidth="5"
          strokeLinecap="round"
          className={meowing ? "anim-wiggle" : ""}
          style={{ transformOrigin: "240px 290px", transformBox: "view-box" }}
        >
          <path d="M168 298 Q120 290 84 276" fill="none" />
          <path d="M166 314 Q116 316 80 312" fill="none" />
          <path d="M168 330 Q124 340 90 350" fill="none" />
          <path d="M312 298 Q360 290 396 276" fill="none" />
          <path d="M314 314 Q364 316 400 312" fill="none" />
          <path d="M312 330 Q356 340 390 350" fill="none" />
        </g>

        {/* collar + bell */}
        <path
          d="M96 356 Q240 420 384 356"
          fill="none"
          stroke="#ff5d5d"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <circle cx="240" cy="392" r="17" fill="#ffc53d" stroke="#2b2118" strokeWidth="5" />
        <path d="M240 386 v10" stroke="#2b2118" strokeWidth="4" strokeLinecap="round" />

        {/* table */}
        <rect x="16" y="420" width="448" height="34" rx="14" fill="#2b2118" />
        <text
          x="240"
          y="444"
          textAnchor="middle"
          fill="#fff3e2"
          fontSize="17"
          fontFamily="Gochi Hand"
          letterSpacing="4"
        >
          certified gop zone
        </text>

        {/* paws on table */}
        <g className="knead-l">
          <rect
            x="128"
            y="386"
            width="76"
            height="58"
            rx="26"
            fill="#ffe3b3"
            stroke="#2b2118"
            strokeWidth="6"
          />
          <path d="M150 392 v14 M170 392 v14" stroke="#2b2118" strokeWidth="4" strokeLinecap="round" />
        </g>
        <g className="knead-r">
          <rect
            x="276"
            y="386"
            width="76"
            height="58"
            rx="26"
            fill="#ffe3b3"
            stroke="#2b2118"
            strokeWidth="6"
          />
          <path d="M298 392 v14 M318 392 v14" stroke="#2b2118" strokeWidth="4" strokeLinecap="round" />
        </g>
      </motion.svg>
    </div>
  );
}
