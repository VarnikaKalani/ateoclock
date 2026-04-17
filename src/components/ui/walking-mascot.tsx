"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const SIZE   = 96;    // display px (64px sprite scaled up 1.5×)
const SPEED  = 0.019; // px/ms
const FPS    = 10;    // matches panda_brown.json

type Phase = "walk" | "idle";

const WALK_FRAMES  = [0, 1, 2, 3];
const IDLE_FRAMES  = [0, 1, 2];       // front animation
const WALK_MS      = 10000;
const IDLE_MS      = 3200;

function spriteUrl(anim: "walk" | "front" | "drag", frame: number) {
  return `/mascot/panda_brown_${anim}-${frame}.png`;
}

export default function WalkingMascot() {
  const [phase,    setPhase]   = useState<Phase>("walk");
  const [frame,    setFrame]   = useState(0);
  const [x,        setX]       = useState(120);
  const [flipped,  setFlipped] = useState(false);
  const [dragging, setDragging]= useState(false);

  const xRef     = useRef(120);
  const dirRef   = useRef(1);
  const phaseRef = useRef<Phase>("walk");
  const rafRef   = useRef<number | null>(null);
  const lastRef  = useRef(0);
  const phaseT   = useRef(0);
  const dragOff  = useRef(0);
  const frameIdx = useRef(0);
  const lastFrT  = useRef(0);

  // Frame ticker driven by rAF (respects FPS)
  const tickFrame = useCallback((now: number) => {
    if (now - lastFrT.current >= 1000 / FPS) {
      lastFrT.current = now;
      const ph  = phaseRef.current;
      const len = ph === "walk" ? WALK_FRAMES.length : IDLE_FRAMES.length;
      frameIdx.current = (frameIdx.current + 1) % len;
      setFrame(frameIdx.current);
    }
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
    lastFrT.current = now0;

    const tick = (now: number) => {
      const dt      = Math.min(now - lastRef.current, 50);
      lastRef.current = now;
      const elapsed   = now - phaseT.current;
      const ph        = phaseRef.current;

      tickFrame(now);

      if (ph === "walk") {
        xRef.current += dirRef.current * SPEED * dt;
        const max = window.innerWidth - SIZE;
        if (xRef.current <= 0)   { xRef.current = 0;   dirRef.current =  1; setFlipped(false); }
        if (xRef.current >= max) { xRef.current = max; dirRef.current = -1; setFlipped(true);  }
        setX(xRef.current);
        if (elapsed >= WALK_MS) {
          phaseRef.current = "idle"; setPhase("idle");
          frameIdx.current = 0; setFrame(0);
          phaseT.current = now;
        }
      } else {
        if (elapsed >= IDLE_MS) {
          phaseRef.current = "walk"; setPhase("walk");
          frameIdx.current = 0; setFrame(0);
          phaseT.current = now;
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
    e.preventDefault();
    setDragging(true);
    dragOff.current = e.clientX - xRef.current;
  }, []);
  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      const nx = Math.max(0, Math.min(window.innerWidth - SIZE, e.clientX - dragOff.current));
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
      const nx = Math.max(0, Math.min(window.innerWidth - SIZE, e.touches[0].clientX - dragOff.current));
      xRef.current = nx; setX(nx);
    };
    const onEnd = () => setDragging(false);
    window.addEventListener("touchmove", onMove, { passive: true });
    window.addEventListener("touchend",  onEnd);
    return () => { window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onEnd); };
  }, [dragging]);

  const anim  = dragging ? "drag" : phase === "walk" ? "walk" : "front";
  const fIdx  = dragging ? 0 : frame;
  const src   = spriteUrl(anim as "walk" | "front" | "drag", fIdx);

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
        src={src}
        alt=""
        width={SIZE}
        height={SIZE}
        style={{
          imageRendering: "pixelated",
          display: "block",
          transform: flipped ? "scaleX(-1)" : undefined,
          filter: "drop-shadow(0 2px 0 rgba(0,0,0,0.18))",
        }}
      />
    </div>
  );
}
