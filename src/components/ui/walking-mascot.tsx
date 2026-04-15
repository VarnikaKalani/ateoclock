"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const W = 72;          // render px
const SPEED = 0.18;    // slow walk px/ms
const FPS = 5;         // slow animation frames
const CLIMB_H = 140;   // px above ground to climb
const WALK_MS  = 4200;
const EAT_MS   = 3000;
const CLIMB_MS = 2400;
const FALL_MS  = 800;

type Phase = "walk" | "eat" | "climb" | "fall";

// ─── Panda SVG ───────────────────────────────────────────────────
function PandaSVG({
  frame, phase, flipped,
}: {
  frame: number; phase: Phase; flipped: boolean;
}) {
  const walking  = phase === "walk";
  const eating   = phase === "eat";
  const climbing = phase === "climb";
  const falling  = phase === "fall";

  // leg bob
  const legAlt = (walking || climbing) && frame === 1;
  const legLy  = legAlt ? 12 : 13;
  const legRy  = legAlt ? 14 : 13;

  // arms: raised when climbing, normal otherwise
  const armLy = climbing ? 4 : 9;
  const armRy = climbing ? 4 : 9;

  // mouth opens on frame 1 while eating
  const mouthOpen = eating && frame === 1;

  // tilt when falling
  const tilt = falling ? (frame ? 22 : -22) : 0;

  return (
    <svg
      width={W}
      height={W}
      viewBox="0 0 16 16"
      style={{
        imageRendering: "pixelated",
        display: "block",
        transform: [
          flipped ? "scaleX(-1)" : "",
          tilt     ? `rotate(${tilt}deg)` : "",
        ].filter(Boolean).join(" ") || undefined,
      }}
    >
      {/* ── Ears ── */}
      <rect x="2"  y="0" width="3" height="3" rx="1.5" fill="#111" />
      <rect x="11" y="0" width="3" height="3" rx="1.5" fill="#111" />

      {/* ── Head ── */}
      <rect x="3" y="1" width="10" height="8" rx="3" fill="#f7f7f7" />

      {/* ── Eye patches ── */}
      <rect x="3" y="2" width="4" height="4" rx="2" fill="#1a1a1a" />
      <rect x="9" y="2" width="4" height="4" rx="2" fill="#1a1a1a" />

      {/* ── Eyes ── */}
      <rect x="4"  y="3" width="2" height="2" rx="1" fill="white" />
      <rect x="10" y="3" width="2" height="2" rx="1" fill="white" />

      {/* ── Pupils ── */}
      <rect x="5"  y="4" width="1" height="1" fill="#111" />
      <rect x="11" y="4" width="1" height="1" fill="#111" />

      {/* ── Nose ── */}
      <rect x="7" y="6" width="2" height="1" rx="0.5" fill="#444" />

      {/* ── Mouth ── */}
      {mouthOpen
        ? <rect x="6" y="7" width="4" height="1.5" rx="0.5" fill="#444" />
        : <rect x="7" y="7" width="2" height="1"   rx="0.5" fill="#555" />
      }

      {/* ── Body ── */}
      <rect x="4" y="8" width="8" height="6" rx="2" fill="#efefef" />

      {/* ── Arms ── */}
      <rect x="1"  y={armLy} width="3" height="4" rx="1.5" fill="#1a1a1a" />
      <rect x="12" y={armRy} width="3" height="4" rx="1.5" fill="#1a1a1a" />

      {/* ── Legs ── */}
      <rect x="4" y={legLy} width="3" height="3" rx="1" fill="#1a1a1a" />
      <rect x="9" y={legRy} width="3" height="3" rx="1" fill="#1a1a1a" />
    </svg>
  );
}

// ─── Bamboo stick (carried) ───────────────────────────────────────
function BambooStick({ angle }: { angle: number }) {
  return (
    <svg
      width={10} height={44}
      viewBox="0 0 5 22"
      style={{
        imageRendering: "pixelated",
        display: "block",
        transform: `rotate(${angle}deg)`,
        transformOrigin: "bottom center",
      }}
    >
      <rect x="2" y="0" width="1.5" height="21" fill="#5c9e30" />
      <rect x="1" y="7"  width="3" height="1.5" rx="0.5" fill="#4a8525" />
      <rect x="1" y="15" width="3" height="1.5" rx="0.5" fill="#4a8525" />
      <ellipse cx="4.5" cy="4"  rx="2.2" ry="0.9" fill="#72bb42" transform="rotate(-32 4.5 4)"  />
      <ellipse cx="0.5" cy="14" rx="2.2" ry="0.9" fill="#72bb42" transform="rotate(32 0.5 14)" />
    </svg>
  );
}

// ─── Bamboo pole (planted, for climbing) ─────────────────────────
function BambooPole({ height }: { height: number }) {
  const segs = Math.ceil(height / 22);
  return (
    <svg
      width={14} height={height}
      viewBox={`0 0 7 ${segs * 22}`}
      style={{ imageRendering: "pixelated", display: "block" }}
    >
      {Array.from({ length: segs }).map((_, i) => (
        <g key={i}>
          <rect x="2.5" y={i * 22}      width="2" height="21" fill="#5c9e30" />
          <rect x="1.5" y={i * 22 + 19} width="4" height="3"  rx="1" fill="#4a8525" />
          {i % 2 === 0
            ? <ellipse cx="6"  cy={i * 22 + 9}  rx="3.2" ry="1.3" fill="#72bb42" transform={`rotate(-28 6 ${i * 22 + 9})`}  />
            : <ellipse cx="1"  cy={i * 22 + 13} rx="3.2" ry="1.3" fill="#72bb42" transform={`rotate(28 1 ${i * 22 + 13})`} />
          }
        </g>
      ))}
    </svg>
  );
}

// ─── Main component ───────────────────────────────────────────────
export default function WalkingMascot() {
  const [phase,   setPhase]   = useState<Phase>("walk");
  const [x,       setX]       = useState(120);
  const [y,       setY]       = useState(0);
  const [frame,   setFrame]   = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [dragging,setDragging]= useState(false);

  const xRef     = useRef(120);
  const yRef     = useRef(0);
  const dirRef   = useRef(1);
  const phaseRef = useRef<Phase>("walk");
  const rafRef   = useRef<number | null>(null);
  const lastRef  = useRef(0);
  const phaseT   = useRef(0);
  const dragOff  = useRef(0);

  // Animation frame ticker
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
        if (xRef.current <= 0)   { xRef.current = 0;   dirRef.current =  1; setFlipped(false); }
        if (xRef.current >= max) { xRef.current = max; dirRef.current = -1; setFlipped(true);  }
        setX(xRef.current);

        if (elapsed >= WALK_MS) {
          phaseRef.current = "eat";
          setPhase("eat");
          phaseT.current = now;
        }

      } else if (ph === "eat") {
        if (elapsed >= EAT_MS) {
          phaseRef.current = "climb";
          setPhase("climb");
          phaseT.current = now;
        }

      } else if (ph === "climb") {
        const t    = Math.min(elapsed / CLIMB_MS, 1);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        yRef.current = ease * CLIMB_H;
        setY(yRef.current);

        if (elapsed >= CLIMB_MS) {
          phaseRef.current = "fall";
          setPhase("fall");
          phaseT.current = now;
        }

      } else { // fall
        const t = Math.min(elapsed / FALL_MS, 1);
        // gravity curve
        yRef.current = CLIMB_H * (1 - t) * (1 - t);
        setY(yRef.current);

        if (elapsed >= FALL_MS) {
          yRef.current = 0;
          setY(0);
          phaseRef.current = "walk";
          setPhase("walk");
          phaseT.current = now;
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
      xRef.current = nx;
      setX(nx);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
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
      xRef.current = nx;
      setX(nx);
    };
    const onEnd = () => setDragging(false);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend",  onEnd);
    return () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend",  onEnd);
    };
  }, [dragging]);

  const showPole = phase === "eat" || phase === "climb" || phase === "fall";
  const poleH    = CLIMB_H + W + 8;
  // bamboo stick angle: held casually while walking, brought to mouth while eating
  const stickAngle = phase === "eat" ? (flipped ? 35 : -35) : (flipped ? -12 : 12);

  return (
    <>
      {/* Bamboo pole — grounded at panda's position */}
      {showPole && (
        <div
          aria-hidden="true"
          style={{
            position:      "fixed",
            bottom:        0,
            left:          x + W * 0.58,
            zIndex:        49,
            pointerEvents: "none",
          }}
        >
          <BambooPole height={poleH} />
        </div>
      )}

      {/* Panda */}
      <div
        aria-hidden="true"
        onMouseDown={onDown}
        onTouchStart={onTouch}
        style={{
          position:    "fixed",
          bottom:      y,
          left:        x,
          width:       W,
          height:      W,
          zIndex:      50,
          cursor:      dragging ? "grabbing" : "grab",
          userSelect:  "none",
          touchAction: "none",
        }}
      >
        {/* Bamboo stick — carried while walking or eating */}
        {(phase === "walk" || phase === "eat") && (
          <div
            style={{
              position:        "absolute",
              ...(flipped ? { left: -8 } : { right: -8 }),
              bottom:          10,
              transformOrigin: "bottom center",
            }}
          >
            <BambooStick angle={stickAngle} />
          </div>
        )}

        <PandaSVG frame={frame} phase={phase} flipped={flipped} />
      </div>
    </>
  );
}
