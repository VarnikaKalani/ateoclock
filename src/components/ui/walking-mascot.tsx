"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const W = 56;
const SPEED = 0.7; // px/ms — matches JSON "speed": 0.7
const FPS = 10;

// Pixel-art ape — 2 walk frames, matches the "ape" character in the config
function ApeSVG({ frame, flipped }: { frame: number; flipped: boolean }) {
  const legL = frame === 0 ? [5, 14] : [5, 13];
  const legR = frame === 0 ? [9, 14] : [9, 15];
  const armL = frame === 0 ? [1, 7]  : [1, 8];
  const armR = frame === 0 ? [12, 7] : [12, 6];

  return (
    <svg
      width={W}
      height={W}
      viewBox="0 0 16 16"
      style={{
        imageRendering: "pixelated",
        transform: flipped ? "scaleX(-1)" : undefined,
        display: "block",
      }}
    >
      {/* Ears */}
      <rect x="2" y="1" width="2" height="2" rx="1" fill="#5C3A1E" />
      <rect x="12" y="1" width="2" height="2" rx="1" fill="#5C3A1E" />
      {/* Head */}
      <rect x="3" y="1" width="10" height="7" rx="2" fill="#6B4423" />
      {/* Face muzzle */}
      <rect x="4" y="4" width="8" height="4" rx="1" fill="#9E6B44" />
      {/* Eyes */}
      <rect x="5" y="3" width="2" height="2" fill="#1A0E08" />
      <rect x="9" y="3" width="2" height="2" fill="#1A0E08" />
      {/* Eye shine */}
      <rect x="6" y="3" width="1" height="1" fill="#fff" opacity="0.5" />
      <rect x="10" y="3" width="1" height="1" fill="#fff" opacity="0.5" />
      {/* Nostrils */}
      <rect x="6" y="6" width="1" height="1" fill="#5C3A1E" />
      <rect x="9" y="6" width="1" height="1" fill="#5C3A1E" />
      {/* Body */}
      <rect x="4" y="7" width="8" height="7" rx="1" fill="#5C3A1E" />
      {/* Belly */}
      <rect x="5" y="8" width="6" height="5" rx="1" fill="#7A5130" />
      {/* Arms */}
      <rect x={armL[0]} y={armL[1]} width="3" height="4" rx="1" fill="#5C3A1E" />
      <rect x={armR[0]} y={armR[1]} width="3" height="4" rx="1" fill="#5C3A1E" />
      {/* Legs */}
      <rect x={legL[0]} y={legL[1]} width="3" height="3" rx="1" fill="#4A2C10" />
      <rect x={legR[0]} y={legR[1]} width="3" height="3" rx="1" fill="#4A2C10" />
    </svg>
  );
}

export default function WalkingMascot() {
  const [x, setX] = useState(160);
  const [flipped, setFlipped] = useState(false);
  const [frame, setFrame] = useState(0);
  const [dragging, setDragging] = useState(false);

  const xRef    = useRef(160);
  const dirRef  = useRef(1); // 1=right, -1=left
  const rafRef  = useRef<number>();
  const lastRef = useRef(0);
  const dragOff = useRef(0);

  // Walk-frame ticker at FPS=10
  useEffect(() => {
    const id = setInterval(() => setFrame(f => 1 - f), 1000 / FPS);
    return () => clearInterval(id);
  }, []);

  // Movement loop
  const startLoop = useCallback(() => {
    lastRef.current = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(now - lastRef.current, 50);
      lastRef.current = now;
      xRef.current += dirRef.current * SPEED * dt;
      const max = window.innerWidth - W;
      if (xRef.current <= 0)   { xRef.current = 0;   dirRef.current =  1; setFlipped(false); }
      if (xRef.current >= max) { xRef.current = max; dirRef.current = -1; setFlipped(true);  }
      setX(xRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  useEffect(() => {
    if (!dragging) startLoop();
    else stopLoop();
    return stopLoop;
  }, [dragging, startLoop, stopLoop]);

  // Mouse drag handlers
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
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
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
    window.addEventListener("touchend", onEnd);
    return () => {
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [dragging]);

  return (
    <div
      aria-hidden="true"
      onMouseDown={onDown}
      onTouchStart={onTouch}
      style={{
        position: "fixed",
        bottom: 0,
        left: x,
        width: W,
        height: W,
        zIndex: 50,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <ApeSVG frame={frame} flipped={flipped} />
    </div>
  );
}
