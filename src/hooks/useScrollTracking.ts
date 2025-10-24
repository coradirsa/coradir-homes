"use client";
import { useEffect, useRef } from 'react';
import { GAEvents } from '@/lib/analytics/gtag';

/**
 * Hook para trackear scroll depth en Google Analytics
 * Dispara eventos en 25%, 50%, 75% y 100% del scroll
 */
export function useScrollTracking() {
  const trackedDepths = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const scrollableHeight = documentHeight - windowHeight;
      const scrollPercentage = Math.round((scrollTop / scrollableHeight) * 100);

      // Checkpoints para trackear
      const checkpoints = [25, 50, 75, 100];

      checkpoints.forEach(checkpoint => {
        if (
          scrollPercentage >= checkpoint &&
          !trackedDepths.current.has(checkpoint)
        ) {
          trackedDepths.current.add(checkpoint);
          GAEvents.scrollDepth(checkpoint, window.location.pathname);
        }
      });
    };

    // Throttle para no disparar demasiados eventos
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);
}
