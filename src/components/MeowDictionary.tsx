import { motion } from "framer-motion";
import { AudioLines, BookOpenText, Play } from "lucide-react";
import { audio, type MeowKind } from "../lib/audio";
import { SectionHeading } from "./MeowBoard";

type Entry = {
  name: string;
  phonetic: string;
  kind: MeowKind;
  pitch: number;
  desc: string;
  time: string;
  color: string;
  img?: string;
  svgArt?: boolean;
};

const ENTRIES: Entry[] = [
  {
    name: "THE CLASSIC",
    phonetic: '[ m j a u ]',
    kind: "meow",
    pitch: 460,
    desc: "Translation: “feed me. again.” Deployed at exactly 5:59 AM, within paw's reach of your face.",
    time: "peak usage: 5:59 AM",
    color: "#ff5d5d",
    img: "/images/cat-classic.png",
  },
  {
    name: "THE MRRP?!",
    phonetic: "[ m r r r p ?! ]",
    kind: "trill",
    pitch: 520,
    desc: "Translation: “excuse me??” Reserved for closed doors, empty laps, and general betrayal.",
    time: "peak usage: whenever you sit",
    color: "#ffc53d",
    img: "/images/cat-mrrp.png",
  },
  {
    name: "THE 3AM OPERA",
    phonetic: "[ m e e o o o w ]",
    kind: "opera",
    pitch: 420,
    desc: "A four-movement aria about a bowl that is — and we cannot stress this enough — half full.",
    time: "peak usage: 3:00 AM sharp",
    color: "#7fb5ff",
    img: "/images/cat-opera.png",
  },
  {
    name: "THE LOAF GRUMBLE",
    phonetic: "[ m r r f ]",
    kind: "grumble",
    pitch: 280,
    desc: "A low-frequency complaint issued from loaf position. The loaf wishes to be left alone.",
    time: "peak usage: your work calls",
    color: "#54d1b2",
    img: "/images/cat-loaf.png",
  },
  {
    name: "THE GOP GOP",
    phonetic: "[ g o p . g o p ]",
    kind: "nya",
    pitch: 0,
    desc: "Biscuits in progress. Do not disturb the bakery. Estimated completion: never.",
    time: "peak usage: blanket o'clock",
    color: "#ff9ec7",
    svgArt: true,
  },
];

function PawArt() {
  return (
    <svg viewBox="0 0 200 140" className="h-full w-full">
      <rect width="200" height="140" fill="#ff9ec7" />
      <g transform="translate(62 70) rotate(-12)">
        <ellipse cx="0" cy="14" rx="26" ry="20" fill="#fffdf8" stroke="#2b2118" strokeWidth="5" />
        <circle cx="-20" cy="-10" r="9" fill="#fffdf8" stroke="#2b2118" strokeWidth="5" />
        <circle cx="0" cy="-17" r="9" fill="#fffdf8" stroke="#2b2118" strokeWidth="5" />
        <circle cx="20" cy="-10" r="9" fill="#fffdf8" stroke="#2b2118" strokeWidth="5" />
      </g>
      <g transform="translate(140 74) rotate(14) scale(0.9)">
        <ellipse cx="0" cy="14" rx="26" ry="20" fill="#fffdf8" stroke="#2b2118" strokeWidth="5" />
        <circle cx="-20" cy="-10" r="9" fill="#fffdf8" stroke="#2b2118" strokeWidth="5" />
        <circle cx="0" cy="-17" r="9" fill="#fffdf8" stroke="#2b2118" strokeWidth="5" />
        <circle cx="20" cy="-10" r="9" fill="#fffdf8" stroke="#2b2118" strokeWidth="5" />
      </g>
    </svg>
  );
}

function EntryCard({ entry, index }: { entry: Entry; index: number }) {
  const play = () => {
    if (entry.svgArt) {
      audio.gop(1);
      window.setTimeout(() => audio.gop(1), 160);
      window.setTimeout(() => audio.gop(0.8), 320);
    } else {
      audio.meow(entry.kind, entry.pitch);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 50, rotate: index % 2 ? 2 : -2 }}
      whileInView={{ opacity: 1, y: 0, rotate: index % 2 ? 1.5 : -1.5 }}
      whileHover={{ rotate: 0, y: -10 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 90, damping: 15 }}
      className="sticker shadow-hard group relative flex w-[280px] shrink-0 flex-col rounded-3xl p-4 sm:w-[320px]"
    >
      {/* image window */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-[3px] border-ink bg-cream-deep">
        {entry.img ? (
          <img
            src={entry.img}
            alt={entry.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
          />
        ) : (
          <PawArt />
        )}
        <span
          className="absolute left-3 top-3 rounded-full border-2 border-ink px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest"
          style={{ background: entry.color }}
        >
          {entry.time}
        </span>
      </div>

      <div className="flex flex-1 flex-col pt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-800 leading-tight">{entry.name}</h3>
          <button
            onClick={play}
            aria-label={`Play ${entry.name}`}
            className="shadow-hard-sm grid size-11 shrink-0 place-items-center rounded-full border-[3px] border-ink transition-all hover:-translate-y-1 group-hover:animate-none active:translate-y-0 active:shadow-hard-none"
            style={{ background: entry.color }}
          >
            <Play className="size-4.5 fill-ink text-ink" strokeWidth={2.5} />
          </button>
        </div>
        <p className="font-hand mt-1 text-xl text-ink/50">{entry.phonetic}</p>
        <p className="mt-3 text-sm font-medium leading-relaxed text-ink/70">{entry.desc}</p>
        <p className="mt-auto flex items-center gap-1.5 pt-4 text-[11px] font-bold uppercase tracking-widest text-ink/40">
          <AudioLines className="size-3.5" strokeWidth={2.5} />
          synthesized live · no cats sampled
        </p>
      </div>
    </motion.article>
  );
}

export default function MeowDictionary() {
  return (
    <section id="dictionary" className="relative px-4 py-24 sm:px-8 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          kicker="field guide"
          title={
            <>
              MEOW <span className="text-outline">DICTIONARY</span>
            </>
          }
          sub="a scientific taxonomy of sounds your landlord has formally prohibited"
        />
      </div>

      <div className="relative">
        <div className="mx-auto flex max-w-6xl items-center gap-2 px-1 pb-4 text-xs font-bold uppercase tracking-[0.25em] text-ink/40">
          <BookOpenText className="size-4" strokeWidth={2.5} />
          scroll sideways · {ENTRIES.length} entries documented
        </div>
        <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-[max(1rem,calc(50vw-36rem))] pb-6 sm:-mx-8">
          {ENTRIES.map((e, i) => (
            <div key={e.name} className="snap-center">
              <EntryCard entry={e} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
