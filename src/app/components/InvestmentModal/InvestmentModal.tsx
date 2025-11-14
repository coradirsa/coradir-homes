"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInvestmentModal } from "./useInvestmentModal";
import InvestmentModalContent from "./InvestmentModalContent";
import type { InvestmentModalProps } from "./types";

const DEFAULT_CONFIG = {
  showOncePerSession: true,
  delayMs: 1200,
  whatsappNumber: "5492664649967",
  trackEvents: false, // Desactivado: control manual desde GTM
};

/**
 * Investment Modal Component
 * Modal accesible para captar leads de inversiones inmobiliarias
 *
 * Features:
 * - Animación suave con Framer Motion
 * - Trap focus para accesibilidad
 * - ESC key para cerrar
 * - Click fuera del modal para cerrar
 * - Validación con Zod + React Hook Form
 * - Integración con WhatsApp
 * - Tracking de eventos GTM
 */
export default function InvestmentModal(props: InvestmentModalProps = {}) {
  const config = { ...DEFAULT_CONFIG, ...props };
  const { isOpen, closeModal } = useInvestmentModal(config);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Trap focus dentro del modal
  useEffect(() => {
    if (!isOpen || !dialogRef.current) return;

    const dialog = dialogRef.current;
    const focusableElements = dialog.querySelectorAll<HTMLElement>(
      'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const focusable = Array.from(focusableElements).filter(
      (el) => !el.hasAttribute("disabled") && el.offsetParent !== null
    );

    if (focusable.length === 0) return;

    const firstElement = focusable[0];
    const lastElement = focusable[focusable.length - 1];

    // Focus en el primer elemento
    firstElement.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  // Handler para click en el backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="investment-modal-container"
          className="fixed inset-0 z-[99999] grid place-items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="investment-modal-title"
        >
          {/* Backdrop con blur */}
          <motion.div
            id="investment-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm cursor-pointer"
          />

          {/* Modal Content */}
          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-[92vw] md:w-auto"
          >
            <InvestmentModalContent
              onClose={closeModal}
              whatsappNumber={config.whatsappNumber!}
              trackEvents={config.trackEvents}
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
