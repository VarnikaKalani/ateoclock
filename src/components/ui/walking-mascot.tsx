"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const W        = 96;     // render px
const SPEED    = 0.019;  // slow amble — reduced ~50% from original
const FPS      = 3;      // chunky pixel-art frames
const WALK_MS  = 10000;
const EAT_MS   = 3200;

type Phase = "walk" | "eat";

// White-and-brown panda, side view, faces RIGHT by default.
// flipped = scaleX(-1) so it always faces its walking direction.
function PandaSVG({
  frame, phase, flipped,
}: { frame: number; phase: Phase; flipped: boolean }) {
  const walking = phase === "walk";
  const eating  = phase === "eat";

  // Diagonal gait: frame toggles which diagonal pair steps
  const stepA = walking && frame === 1;

  // Near-side legs (fully visible)
  const nFrontY = stepA ? 20 : 22;
  const nRearY  = stepA ? 22 : 20;
  // Far-side legs (behind body, faded)
  const fFrontY = stepA ? 22 : 20;
  const fRearY  = stepA ? 20 : 22;

  // Body bobs on each step
  const bodyDY = walking ? (stepA ? 0.8 : 0) : 0;
  // Head dips when eating, small nod when walking
  const headDY = eating ? (frame ? 2 : 0) : walking ? (stepA ? 0.4 : 0) : 0;

  // Mouth opens when eating frame 1
  const mouthOpen = eating && frame === 1;

  const outline = { stroke: "#1a0800", strokeLinejoin: "round" as const };

  return (
    <svg
      width={W}
      height={W}
      viewBox="0 0 48 30"
      shapeRendering="crispEdges"
      style={{
        imageRendering: "pixelated",
        display: "block",
        filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.18))",
        transform: flipped ? "scaleX(-1)" : undefined,
      }}
    >
      {/* Ground shadow */}
      <ellipse cx="22" cy="29.8" rx="13" ry="1.1" fill="rgba(0,0,0,0.12)" />

      {/* Far-side legs behind body (faded for depth) */}
      <rect x="13" y={fRearY}  width="3.8" height="8.5" rx="1.9"
        fill="#6B3E1E" opacity="0.55" {...outline} strokeWidth="0.7" />
      <rect x="30" y={fFrontY} width="3.8" height="8.5" rx="1.9"
        fill="#6B3E1E" opacity="0.55" {...outline} strokeWidth="0.7" />

      {/* Body */}
      <g transform={`translate(0 ${bodyDY})`}>
        {/* Main white body oval */}
        <ellipse cx="22" cy="20" rx="14.5" ry="9.5"
          fill="#FFFFFF" {...outline} strokeWidth="1.4" />

        {/* 3D highlight — top of body */}
        <ellipse cx="20" cy="15.8" rx="7" ry="3.2"
          fill="rgba(255,255,255,0.55)" />

        {/* Hip patch (rear) — brown */}
        <ellipse cx="12" cy="19" rx="6"  ry="5.5"
          fill="#8B4C1E" {...outline} strokeWidth="0.9" />
        {/* Hip 3D highlight */}
        <ellipse cx="11" cy="17" rx="2.8" ry="2"
          fill="rgba(255,255,255,0.22)" />

        {/* Shoulder patch (front) — brown */}
        <ellipse cx="32" cy="18" rx="6.5" ry="6"
          fill="#8B4C1E" {...outline} strokeWidth="0.9" />
        {/* Shoulder 3D highlight */}
        <ellipse cx="31" cy="16" rx="3" ry="2"
          fill="rgba(255,255,255,0.22)" />

        {/* Near-side legs in front of body */}
        <rect x="10" y={nRearY}  width="4.5" height="9.5" rx="2.2"
          fill="#7B4A1E" {...outline} strokeWidth="1.1" />
        <rect x="32" y={nFrontY} width="4.5" height="9.5" rx="2.2"
          fill="#7B4A1E" {...outline} strokeWidth="1.1" />
      </g>

      {/* Head and neck — separate so it can nod independently */}
      <g transform={`translate(0 ${headDY})`}>
        {/* Neck blob blends head into body */}
        <ellipse cx="33" cy="17.5" rx="5" ry="4"
          fill="#FFFFFF" {...outline} strokeWidth="0.9" />

        {/* Round white head — bigger circle for cuter proportions */}
        <circle cx="36" cy="11" r="10.5"
          fill="#FFFFFF" {...outline} strokeWidth="1.5" />

        {/* 3D highlight — top of head */}
        <ellipse cx="33.5" cy="6.5" rx="5" ry="2.8"
          fill="rgba(255,255,255,0.5)" />

        {/* Far ear — brown with warm inner */}
        <circle cx="43" cy="3.5" r="3.8" fill="#8B4C1E" {...outline} strokeWidth="0.8" />
        <circle cx="43" cy="3.5" r="1.6" fill="#C87850" />

        {/* Near ear — brown with warm inner */}
        <circle cx="29.5" cy="3.5" r="4.2" fill="#8B4C1E" {...outline} strokeWidth="1.1" />
        <circle cx="29.5" cy="3.5" r="1.9" fill="#C87850" />

        {/* Eye patch — large brown oval, rounded for cuteness */}
        <ellipse cx="40" cy="10" rx="5" ry="4.5"
          fill="#8B4C1E" {...outline} strokeWidth="0.9" />

        {/* Eye white — bigger for cuter look */}
        <circle cx="40.5" cy="10" r="3" fill="white" />
        {/* Pupil */}
        <circle cx="41.2" cy="10.4" r="1.8" fill="#1a0800" />
        {/* Main shine */}
        <circle cx="42.2" cy="9.2"  r="0.7" fill="white" />
        {/* Small secondary shine */}
        <circle cx="40.2" cy="11.3" r="0.35" fill="white" />

        {/* Muzzle — near-white rounded snout */}
        <ellipse cx="44.5" cy="14.5" rx="4"   ry="3.2"
          fill="#F8F4EE" {...outline} strokeWidth="0.8" />
        {/* Nose — cute oval */}
        <ellipse cx="45.5" cy="12.8" rx="2"   ry="1.3"
          fill="#8B4C1E" {...outline} strokeWidth="0.6" />

        {/* Mouth */}
        {mouthOpen ? (
          <rect x="43.5" y="15.5" width="4" height="1.8" rx="0.8" fill="#8B4C1E" />
        ) : (
          <path
            d="M43.5 15.5 Q45.5 17 47 15.5"
            stroke="#8B4C1E" strokeWidth="0.8"
            fill="none" strokeLinecap="round"
          />
        )}

        {/* Cheek blush — soft and round */}
        <circle cx="37.5" cy="13.5" r="2.8" fill="rgba(228,130,110,0.30)" />
      </g>
    </svg>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function WalkingMascot() {
  const [phase,    setPhase]    = useState<Phase>("walk");
  const [x,        setX]        = useState(120);
  const [frame,    setFrame]    = useState(0);
  const [flipped,  setFlipped]  = useState(false);
  const [dragging, setDragging] = useState(false);

  const xRef     = useRef(120);
  const dirRef   = useRef(1);
  const phaseRef = useRef<Phase>("walk");
  const rafRef   = useRef<number | null>(null);
  const lastRef  = useRef(0);
  const phaseT   = useRef(0);
  const dragOff  = useRef(0);

  // Slow frame ticker
  useEffect(() => {
    const id = setInterval(() => setFrame(f => 1 - f), 1000 / FPS);
    return () => clearInterval(id);
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    const now0 = performance.now();
    lastRef.current = now0;
    phaseT.current  = now0;

    const tick = (now: number) => {
      const dt      = Math.min(now - lastRef.current, 50);
      lastRef.current = now;
      const elapsed   = now - phaseT.current;
      const ph        = phaseRef.current;

      if (ph === "walk") {
        xRef.current += dirRef.current * SPEED * dt;
        const max = window.innerWidth - W;
        // Turn to face walking direction when hitting walls
        if (xRef.current <= 0)   { xRef.current = 0;   dirRef.current =  1; setFlipped(false); }
        if (xRef.current >= max) { xRef.current = max; dirRef.current = -1; setFlipped(true);  }
        setX(xRef.current);
        if (elapsed >= WALK_MS) {
          phaseRef.current = "eat"; setPhase("eat"); phaseT.current = now;
        }
      } else if (ph === "eat") {
        if (elapsed >= EAT_MS) {
          phaseRef.current = "walk"; setPhase("walk"); phaseT.current = now;
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!dragging) startLoop();
    else stopLoop();
    return stopLoop;
  }, [dragging, startLoop, stopLoop]);

  // Mouse drag
  const onDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragOff.current = e.clientX - xRef.current;
  }, []);
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const nx = Math.max(0, Math.min(window.innerWidth - W, e.clientX - dragOff.current));
      xRef.current = nx; setX(nx);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  // Touch drag
  const onTouch = useCallback((e: React.TouchEvent) => {
    dragOff.current = e.touches[0].clientX - xRef.current;
    setDragging(true);
  }, []);
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: TouchEvent) => {
      const nx = Math.max(0, Math.min(window.innerWidth - W, e.touches[0].clientX - dragOff.current));
      xRef.current = nx; setX(nx);
    };
    const onEnd = () => setDragging(false);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend",  onEnd);
    return () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
  }, [dragging]);

  return (
    <div
      aria-hidden="true"
      onMouseDown={onDown}
      onTouchStart={onTouch}
      style={{
        position: "fixed", bottom: 0, left: x,
        width: W, height: W, zIndex: 50,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none", touchAction: "none",
      }}
    >
      <PandaSVG frame={frame} phase={phase} flipped={flipped} />
    </div>
  );
}
