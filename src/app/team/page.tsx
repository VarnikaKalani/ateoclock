"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { GridBackground } from "@/components/ui/grid-background";

const RED   = "#74823F";
const CREAM = "#F1E8C7";
const BROWN = "#6B3E1E";
const INTER = "var(--font-inter), sans-serif";

const IMAGES = [
  { src: "/varvans3.png", label: "Varnika & Vanshika" },
  { src: "/varvans2.jpg", label: "Varnika & Vanshika" },
  { src: "/varvans1.jpg", label: "Varnika & Vanshika" },
  { src: "/var1.jpg",     label: "Varnika" },
  { src: "/vans1.jpg",    label: "Vanshika" },
  { src: "/var2.jpg",     label: "Varnika" },
  { src: "/vans2.JPG",    label: "Vanshika" },
  { src: "/var3.JPG",     label: "Varnika" },
  { src: "/var4.jpg",     label: "Varnika" },
  { src: "/var5.jpg",     label: "Varnika" },
];

const variants = {
  enter: (d: number) => ({ rotateY: d > 0 ? 90 : -90, opacity: 0, scale: 0.96 }),
  center: { rotateY: 0, opacity: 1, scale: 1 },
  exit:  (d: number) => ({ rotateY: d < 0 ? 90 : -90, opacity: 0, scale: 0.96 }),
};

function PolaroidStack() {
  const [[idx, dir], setPage] = useState([0, 1]);

  const advance = () => setPage(([i]) => [(i + 1) % IMAGES.length, 1]);
  const back    = () => setPage(([i]) => [(i - 1 + IMAGES.length) % IMAGES.length, -1]);

  const img = IMAGES[idx];

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
      {/* Stack chrome */}
      <div style={{ position: "relative", width: 272, cursor: "pointer" }} onClick={advance}>
        {/* Card shadows behind */}
        <div style={{
          position: "absolute", inset: 0,
          background: "white", borderRadius: 4,
          transform: "rotate(4deg) translate(6px,8px)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
        }} />
        <div style={{
          position: "absolute", inset: 0,
          background: "white", borderRadius: 4,
          transform: "rotate(-2deg) translate(-3px,4px)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }} />

        {/* Active card */}
        <div style={{ position: "relative", perspective: "1000px" }}>
          <AnimatePresence initial={false} custom={dir} mode="wait">
            <motion.div
              key={idx}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: "easeInOut" }}
              style={{
                background: "white",
                borderRadius: 4,
                padding: "12px 12px 48px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.16)",
                transformStyle: "preserve-3d",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.label}
                style={{ width: "100%", height: 300, objectFit: "cover", display: "block", borderRadius: 2 }}
                onError={(e) => {
                  e.currentTarget.style.background = "rgba(116,130,63,.08)";
                  e.currentTarget.style.height = "300px";
                }}
              />
              <div style={{
                position: "absolute", bottom: 12, left: 0, right: 0,
                textAlign: "center",
                fontFamily: INTER,
                fontSize: 12,
                color: "rgba(107,62,30,.52)",
                letterSpacing: "0.04em",
              }}>
                {img.label}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={back}
          style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "1px solid rgba(107,62,30,.18)",
            background: "rgba(255,255,255,.72)",
            color: BROWN, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          aria-label="Previous photo"
        >
          <ArrowLeft size={14} strokeWidth={2.4} />
        </button>
        <span style={{ fontSize: 11, color: "rgba(116,130,63,.52)", fontWeight: 600, letterSpacing: ".06em" }}>
          {idx + 1} / {IMAGES.length}
        </span>
        <button
          onClick={advance}
          style={{
            width: 32, height: 32, borderRadius: "50%",
            border: "1px solid rgba(107,62,30,.18)",
            background: "rgba(255,255,255,.72)",
            color: BROWN, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
          aria-label="Next photo"
        >
          <ArrowRight size={14} strokeWidth={2.4} />
        </button>
      </div>
      <p style={{ fontSize: 11, color: "rgba(116,130,63,.42)", margin: 0 }}>click photo or arrows to flip</p>
    </div>
  );
}

const P: React.CSSProperties = {
  color: "rgba(90,62,28,.82)",
  fontSize: 16,
  lineHeight: 1.78,
  fontFamily: INTER,
  marginBottom: 18,
};

const HIGHLIGHT: React.CSSProperties = {
  color: BROWN,
  fontWeight: 600,
};

const TEAM_STYLES = `
  .team-shell {
    width: min(900px, calc(100% - 40px));
    margin: 0 auto;
    padding: 80px 0 100px;
  }
  .team-heading { margin-bottom: 36px; }
  .team-content {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 52px;
    align-items: start;
  }
  @media (max-width: 700px) {
    .team-shell {
      width: calc(100% - 32px);
      padding: 72px 0 64px;
    }
    .team-heading {
      margin-bottom: 28px;
    }
    .team-content {
      grid-template-columns: 1fr;
      gap: 36px;
    }
  }
`;

export default function TeamPage() {
  return (
    <GridBackground
      patternId="team-grid"
      style={{ minHeight: "100vh", background: CREAM, color: RED, fontFamily: "var(--font-inter), sans-serif" }}
    >
      <style>{TEAM_STYLES}</style>
      {/* Back button */}
      <Link
        href="/"
        replace
        prefetch={false}
        aria-label="Go back"
        style={{
          position: "fixed", top: 24, left: 28, zIndex: 5,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 44, height: 44,
          border: "1px solid rgba(107,62,30,.18)", borderRadius: 8,
          background: "rgba(255,255,255,.72)", color: BROWN,
          boxShadow: "0 14px 34px rgba(107,62,30,.08)", textDecoration: "none",
        }}
      >
        <ArrowLeft size={20} strokeWidth={2.4} />
      </Link>

      <div className="team-shell">
        {/* Heading */}
        <div className="team-heading">
          <p style={{ marginBottom: 10, color: BROWN, fontSize: 11, fontWeight: 800, letterSpacing: ".14em", textTransform: "uppercase" }}>
            Meet the team
          </p>
          <h1 style={{ marginBottom: 10, color: RED, fontFamily: INTER, fontSize: "clamp(1.5rem,2.8vw,1.9rem)", fontWeight: 400, lineHeight: 1.1, letterSpacing: "-0.025em" }}>
            The people building ateoclock.
          </h1>
          <a
            href="/#about"
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: BROWN, fontSize: 13, fontWeight: 700, textDecoration: "none", opacity: 0.72 }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
            onMouseLeave={e => (e.currentTarget.style.opacity = ".72")}
          >
            See how it works <ArrowRight size={13} strokeWidth={2.5} />
          </a>
        </div>

        {/* Two-column: photo left, text right */}
        <div className="team-content">
          <PolaroidStack />

          {/* Story */}
          <div style={{ paddingTop: 4 }}>
            <p style={P}>
              Hi, we&rsquo;re <span style={HIGHLIGHT}>Varnika and Vanshika</span>, twins from India who love food and are always excited to try something new. But can we cook?
            </p>
            <p style={P}>
              Honestly, only with instructions, whether that&rsquo;s a step-by-step video or a quick FaceTime with mom.
            </p>
            <p style={P}>
              We were always saving recipes, sending them to each other, and feeling fully convinced we&rsquo;d make them, but somewhere between the inspiration and the ingredients, it all started to feel like too much effort.
            </p>
            <p style={P}>
              That got us thinking. So many people want to make food, but the journey from <span style={HIGHLIGHT}>&ldquo;this looks good&rdquo;</span> to <span style={HIGHLIGHT}>&ldquo;what do I need to buy?&rdquo;</span> is still way too messy.
            </p>
            <p style={{ ...P, color: BROWN, fontWeight: 600, fontSize: 17, marginBottom: 22 }}>
              That idea turned into ateoclock.
            </p>
            <p style={P}>
              We built it for people like us - people who love food, love discovering new dishes, and want the path from recipe to dinner to feel a lot simpler.
            </p>
            <p style={{
              ...P,
              fontStyle: "italic",
              color: BROWN,
              fontSize: 16,
              borderLeft: `3px solid rgba(107,62,30,.2)`,
              paddingLeft: 18,
              marginBottom: 0,
            }}>
              Because by 8 o&rsquo;clock, you should be eating, not building a grocery list from scratch.
            </p>
          </div>
        </div>
      </div>
    </GridBackground>
  );
}
