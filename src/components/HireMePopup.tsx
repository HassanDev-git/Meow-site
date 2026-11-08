import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X } from "lucide-react";

export default function HireMePopup() {
  const [isOpen, setIsOpen] = useState(false);

  // Show popup after a short delay
  useState(() => {
    setTimeout(() => setIsOpen(true), 5000);
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative max-w-md w-full bg-cream border-[3px] border-ink shadow-[8px_8px_0_#2b2118] rounded-3xl p-8 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-3 -right-3 size-8 rounded-full bg-coral border-[3px] border-ink text-cream flex items-center justify-center hover:scale-110 transition-transform"
          >
            <X className="size-4" strokeWidth={3} />
          </button>

          <div className="mb-6 flex justify-center">
            <div className="size-16 rounded-2xl bg-butter border-[3px] border-ink flex items-center justify-center shadow-hard-sm">
              <ExternalLink className="size-8 text-ink" strokeWidth={2.5} />
            </div>
          </div>

          <h3 className="font-display text-2xl font-800 mb-3 text-ink">
            Want a site like this?
          </h3>
          
          <p className="font-body text-ink/70 mb-8 leading-relaxed">
            I can build professional, high-performance, and unique websites 
            tailored to your needs. Let&apos;s bring your vision to life!
          </p>

          <a
            href="https://hkdeveloper.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full py-4 bg-coral text-cream font-display font-800 rounded-2xl border-[3px] border-ink shadow-[4px_4px_0_#2b2118] hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Visit hkdeveloper.tech
            <ExternalLink className="size-4" strokeWidth={3} />
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
