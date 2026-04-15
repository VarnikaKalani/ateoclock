"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion } from "framer-motion";
import { useRef, useEffect, ReactNode } from "react";

interface GridBackgroundProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  patternId?: string;
}

function GridSVG({ id, stroke }: { id: string; stroke: string }) {
  return (
    <svg
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
    >
      <defs>
        <pattern id={id} width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={stroke} strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

export function GridBackground({
  children,
  className,
  style,
  patternId = "grid-bg",
}: GridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(rect.width * 0.5);
    mouseY.set(rect.height * 0.5);
  }, [mouseX, mouseY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const maskImage = useMotionTemplate`radial-gradient(400px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
      onMouseMove={handleMouseMove}
    >
      {/* Base grid - always visible */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        <GridSVG id={`${patternId}-base`} stroke="rgba(116,130,63,0.1)" />
      </div>

      {/* Reveal grid - follows cursor */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          maskImage,
          WebkitMaskImage: maskImage,
        }}
      >
        <GridSVG id={`${patternId}-reveal`} stroke="rgba(116,130,63,0.32)" />
      </motion.div>

      {/* Content sits above grids */}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}
