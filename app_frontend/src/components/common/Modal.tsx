import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal = ({ isOpen, title, onClose, children }: ModalProps) => (
  <AnimatePresence>
    {isOpen ? (
      <motion.div
        className="fixed inset-0 z-[70] flex items-end justify-center bg-[color:var(--overlay)] p-4 md:items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-lg rounded-3xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 text-[color:var(--text-secondary)] shadow-[0_24px_48px_rgba(0,0,0,0.35)]"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          onClick={(event) => event.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          {children}
        </motion.div>
      </motion.div>
    ) : null}
  </AnimatePresence>
);
