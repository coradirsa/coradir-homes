"use client";
import { useScrollTracking } from "@/hooks/useScrollTracking";

/**
 * Componente para trackear scroll depth automáticamente
 * Se debe incluir en el layout principal
 */
export default function ScrollTracker() {
  useScrollTracking();
  return null;
}
