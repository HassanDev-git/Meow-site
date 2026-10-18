import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";

export default function Preloader() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] grid place-items-center bg-cream"
      exit={{ y: "-100%", transition: { duration: 0.7, ease: [0.83, 0, 0.17, 1] } }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              initial={{ y: 0, scale: 1 }}
              animate={{ y: [0, -18, 0], scale: [1, 1.15, 1] }}
              transition={{
                duration: 0.7,
                repeat: Infinity,
                delay: i * 0.16,
                ease: "easeInOut",
              }}
              className="grid size-12 place-items-center rounded-2xl border-[3px] border-ink"
              style={{
                background: ["#ff5d5d", "#ffc53d", "#54d1b2"][i],
                boxShadow: "3px 3px 0 #2b2118",
              }}
            >
              <PawPrint className="size-6 text-ink" strokeWidth={2.5} />
            </motion.span>
          ))}
        </div>
        <p className="font-hand text-2xl text-ink/70">warming up the purrs…</p>
      </div>
    </motion.div>
  );
}
