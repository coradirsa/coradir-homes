 "use client";

import {  animate, useInView, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function Counter({ end, duration = 1.2,  }: { end: number; duration?: number; }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true }); // corre solo una vez
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  // actualizar el número mostrado cuando cambia el MotionValue
  useEffect(() => {
    const unsub = mv.on("change", (v) => setDisplay(Math.floor(v)));
    return () => unsub();
  }, [mv]);

  // animar cuando entra en vista
  useEffect(() => {
    if (!isInView) return;
    const controls = animate(mv, end, {
      duration,
      ease: "easeOut",
    });
    return () => controls.stop();
  }, [isInView, end, duration, mv]);

  return (
    <span ref={ref} className="text-blue text-center text-7xl xl:text-[154px]">
       {display}
    </span>
  );
}