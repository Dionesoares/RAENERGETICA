import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function TiltCard({ children, className = "", intensity = 12, glow = true }) {
  const ref = useRef(null);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [intensity, -intensity]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-intensity, intensity]), { stiffness: 150, damping: 18 });
  const [hover, setHover] = useState(false);

  const glowBg = useTransform(
    [mx, my],
    ([x, y]) => `radial-gradient(400px circle at ${x * 100}% ${y * 100}%, hsl(199 89% 48% / 0.22), transparent 60%)`
  );

  const handleMove = (e) => {
    if (reduceMotion) return;
    const rect = ref.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        mx.set(0.5);
        my.set(0.5);
      }}
      style={{ rotateX: reduceMotion ? 0 : rx, rotateY: reduceMotion ? 0 : ry, transformStyle: "preserve-3d" }}
      className={`relative rounded-2xl ${className}`}
    >
      {children}
      {glow && !reduceMotion && (
        <motion.div
          aria-hidden
          style={{ background: glowBg, opacity: hover ? 1 : 0 }}
          className="pointer-events-none absolute inset-0 rounded-2xl transition-opacity duration-300"
        />
      )}
    </motion.div>
  );
}