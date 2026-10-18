import { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Volume2, VolumeX } from "lucide-react";
import { audio } from "../lib/audio";

const LINKS = [
  { label: "Meow Board", href: "#board" },
  { label: "Gop Machine", href: "#gopgop" },
  { label: "Dictionary", href: "#dictionary" },
];

export default function Navbar() {
  const [muted, setMuted] = useState(false);

  const toggle = () => {
    const next = !muted;
    setMuted(next);
    audio.setMuted(next);
    if (!next) audio.meow("nya", 520);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1.6, type: "spring", stiffness: 120, damping: 18 }}
      className="fixed inset-x-0 top-4 z-50 flex justify-center px-4"
    >
      <nav className="sticker shadow-hard flex w-full max-w-3xl items-center justify-between gap-3 rounded-2xl px-4 py-2.5 sm:px-5">
        <a href="#top" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl border-[3px] border-ink bg-coral">
            <PawPrint className="size-5 text-cream" strokeWidth={2.5} />
          </span>
          <span className="font-display text-sm font-800 tracking-tight sm:text-base">
            Meow<span className="text-coral">-</span>Gop
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-xl px-3 py-1.5 text-sm font-semibold transition-colors hover:bg-cream-deep"
            >
              {l.label}
            </a>
          ))}
        </div>

        <button
          onClick={toggle}
          aria-label={muted ? "Unmute" : "Mute"}
          className="shadow-hard-sm grid size-9 place-items-center rounded-xl border-[3px] border-ink bg-butter transition-transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-hard-none"
        >
          {muted ? (
            <VolumeX className="size-4.5" strokeWidth={2.5} />
          ) : (
            <Volume2 className="size-4.5" strokeWidth={2.5} />
          )}
        </button>
      </nav>
    </motion.header>
  );
}
