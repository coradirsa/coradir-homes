"use client";

import { useState, useEffect, useCallback } from "react";
import type { UseInvestmentModalReturn, InvestmentModalConfig } from "./types";

const STORAGE_KEY = "cd_investment_modal_shown";

/**
 * Hook para controlar la lógica del modal de inversiones
 * Maneja: timing, sesión storage, keyboard events, focus trap
 */
export function useInvestmentModal(config: InvestmentModalConfig = {}): UseInvestmentModalReturn {
  const {
    showOncePerSession = true,
    delayMs = 1200,
    trackEvents = true,
  } = config;

  const [isOpen, setIsOpen] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);

  // Verificar si ya se mostró en esta sesión
  useEffect(() => {
    if (showOncePerSession && typeof window !== "undefined") {
      const hasShown = sessionStorage.getItem(STORAGE_KEY);
      if (hasShown) {
        setShouldShow(false);
      }
    }
  }, [showOncePerSession]);

  // Abrir modal con delay
  useEffect(() => {
    if (!shouldShow) return;

    const timer = setTimeout(() => {
      setIsOpen(true);
      if (showOncePerSession && typeof window !== "undefined") {
        sessionStorage.setItem(STORAGE_KEY, "1");
      }

      // GTM Event: modal abierto
      if (trackEvents && typeof window !== "undefined") {
        const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
        if (dataLayer) {
          dataLayer.push({
            event: "investment_modal_open",
            modal_name: "Inversiones Inmobiliarias",
          });
        }
      }
    }, delayMs);

    return () => clearTimeout(timer);
  }, [shouldShow, delayMs, showOncePerSession, trackEvents]);

  // Handlers
  const openModal = useCallback(() => {
    setIsOpen(true);
    if (trackEvents && typeof window !== "undefined") {
      const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
      if (dataLayer) {
        dataLayer.push({
          event: "investment_modal_open",
          modal_name: "Inversiones Inmobiliarias",
          trigger: "manual",
        });
      }
    }
  }, [trackEvents]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    if (trackEvents && typeof window !== "undefined") {
      const dataLayer = (window as Window & { dataLayer?: unknown[] }).dataLayer;
      if (dataLayer) {
        dataLayer.push({
          event: "investment_modal_close",
          modal_name: "Inversiones Inmobiliarias",
        });
      }
    }
  }, [trackEvents]);

  // ESC key listener
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, closeModal]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return {
    isOpen,
    openModal,
    closeModal,
    shouldShow,
  };
}
