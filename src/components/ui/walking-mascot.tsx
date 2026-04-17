"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SIZE     = 96;    // display px
const SPEED    = 0.019; // px/ms
const FPS      = 10;
const WALK_MS  = 10000;
const IDLE_MS  = 3200;
const WALK_LEN = 4;
const IDLE_LEN = 3;

type Phase = "walk" | "idle";
type Dir   = "right" | "left";

function src(phase: Phase, dir: Dir, frame: number, dragging: boolean) {
  if (dragging)         return `/mascot/panda_${dir}_drag-0.png`;
  if (phase === "idle") return `/mascot/panda_front-${frame}.png`;
  return `/mascot/panda_${dir}_walk-${frame}.png`;
}

export default function WalkingMascot() {
  const [phase,    setPhase]    = useState<Phase>("walk");
  const [frame,    setFrame]    = useState(0);
  const [x,        setX]        = useState(120);
  const [dir,      setDir]      = useState<Dir>("right");
  const [dragging, setDragging] = useState(false);

  const xRef     = useRef(120);
  const dirRef   = useRef<Dir>("right");
  const phaseRef = useRef<Phase>("walk");
  const rafRef   = useRef<number | null>(null);
  const lastRef  = useRef(0);
  const phaseT   = useRef(0);
  const dragOff  = useRef(0);
  const fIdx     = useRef(0);
  const lastFrT  = useRef(0);

  const tickFrame = useCallback((now: number) => {
    if (now - lastFrT.current >= 1000 / FPS) {
      lastFrT.current = now;
      const len = phaseRef.current === "walk" ? WALK_LEN : IDLE_LEN;
      fIdx.current = (fIdx.current + 1) % len;
      setFrame(fIdx.current);
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const startLoop = useCallback(() => {
    const t0 = performance.now();
    lastRef.current = t0; phaseT.current = t0; lastFrT.current = t0;

    const tick = (now: number) => {
      const dt      = Math.min(now - lastRef.current, 50);
      lastRef.current = now;
      const elapsed   = now - phaseT.current;

      tickFrame(now);

      if (phaseRef.current === "walk") {
        xRef.current += (dirRef.current === "right" ? 1 : -1) * SPEED * dt;
        const max = window.innerWidth - SIZE;
        if (xRef.current <= 0)   { xRef.current = 0;   dirRef.current = "right"; setDir("right"); }
        if (xRef.current >= max) { xRef.current = max; dirRef.current = "left";  setDir("left");  }
        setX(xRef.current);
        if (elapsed >= WALK_MS) {
          phaseRef.current = "idle"; setPhase("idle");
          fIdx.current = 0; setFrame(0); phaseT.current = now;
        }
      } else {
        if (elapsed >= IDLE_MS) {
          phaseRef.current = "walk"; setPhase("walk");
          fIdx.current = 0; setFrame(0); phaseT.current = now;
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [tickFrame]);

  useEffect(() => {
    if (!dragging) startLoop();
    else stopLoop();
    return stopLoop;
  }, [dragging, startLoop, stopLoop]);

  // Mouse drag
  const onDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault(); setDragging(true);
    dragOff.current = e.clientX - xRef.current;
  }, []);
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const nx = Math.max(0, Math.min(window.innerWidth - SIZE, e.clientX - dragOff.current));
      if (nx > xRef.current) { dirRef.current = "right"; setDir("right"); }
      else if (nx < xRef.current) { dirRef.current = "left"; setDir("left"); }
      xRef.current = nx; setX(nx);
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, [dragging]);

  // Touch drag
  const onTouch = useCallback((e: React.TouchEvent) => {
    dragOff.current = e.touches[0].clientX - xRef.current; setDragging(true);
  }, []);
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: TouchEvent) => {
      const nx = Math.max(0, Math.min(window.innerWidth - SIZE, e.touches[0].clientX - dragOff.current));
      if (nx > xRef.current) { dirRef.current = "right"; setDir("right"); }
      else if (nx < xRef.current) { dirRef.current = "left"; setDir("left"); }
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
        width: SIZE, height: SIZE, zIndex: 50,
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none", touchAction: "none",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src(phase, dir, frame, dragging)}
        alt=""
        width={SIZE}
        height={SIZE}
        style={{ imageRendering: "pixelated", display: "block",
                 filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.18))" }}
      />
    </div>
  );
}
