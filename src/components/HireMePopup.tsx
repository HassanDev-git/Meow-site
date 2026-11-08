import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, X, Sparkles } from "lucide-react";

export default function HireMePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBeenClosed, setHasBeenClosed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setHasBeenClosed(true);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative max-w-md w-full bg-cream border-[3px] border-ink shadow-[8px_8px_0_#2b2118] rounded-3xl p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleClose}
                className="absolute -top-3 -right-3 size-8 rounded-full bg-coral border-[3px] border-ink text-cream flex items-center justify-center hover:scale-110 transition-transform z-10"
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
        )}
      </AnimatePresence>

      {hasBeenClosed && !isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-[100] group flex items-center gap-3 bg-coral border-[3px] border-ink text-cream px-4 py-3 rounded-2xl shadow-hard hover:translate-y-0.5 hover:shadow-none transition-all"
          aria-label="Open hire me popup"
        >
          <div className="grid size-8 place-items-center rounded-lg bg-butter border-[2px] border-ink">
            <Sparkles className="size-4 text-ink" strokeWidth={2.5} />
          </div>
          <span className="font-display text-sm font-800 whitespace-nowrap">Need a Website?</span>
        </motion.button>
      )}
    </>
  );
}
