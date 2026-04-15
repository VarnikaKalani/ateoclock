"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Heart, ChevronDown, SendHorizonal } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";

const RED    = "#74823F";
const CREAM  = "#F1E8C7";
const BROWN  = "#6B3E1E";
const FIELD_BG = "#FFFDF4";
const INTER_REGULAR = "var(--font-inter), sans-serif";
const DEFAULT_LOVE_COUNT = 501;

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Argentina","Australia","Austria",
  "Bangladesh","Belgium","Brazil","Canada","Chile","China","Colombia",
  "Croatia","Czech Republic","Denmark","Egypt","Ethiopia","Finland",
  "France","Germany","Ghana","Greece","Hungary","India","Indonesia",
  "Iran","Iraq","Ireland","Israel","Italy","Japan","Jordan","Kenya",
  "Malaysia","Mexico","Morocco","Netherlands","New Zealand","Nigeria",
  "Norway","Pakistan","Peru","Philippines","Poland","Portugal",
  "Romania","Russia","Saudi Arabia","Singapore","South Africa",
  "South Korea","Spain","Sri Lanka","Sweden","Switzerland","Taiwan",
  "Thailand","Turkey","Uganda","Ukraine","United Arab Emirates",
  "United Kingdom","United States","Vietnam","Zimbabwe",
];

const STYLES = `
  @keyframes loveBurstFloat {
    0%   { opacity:0; transform:translate3d(0,46px,0) scale(.6) rotate(-8deg); }
    22%  { opacity:.9; }
    100% { opacity:0; transform:translate3d(var(--love-x),-112vh,0) scale(var(--love-scale)) rotate(18deg); }
  }
  .love-burst { position:fixed; inset:0; z-index:20; pointer-events:none; overflow:hidden; }
  .love-burst-heart {
    position:absolute; left:var(--love-left); bottom:-42px;
    color:rgba(107,62,30,.72);
    filter:drop-shadow(0 10px 18px rgba(107,62,30,.14));
    animation:loveBurstFloat 8s cubic-bezier(.16,.72,.22,1) both;
    animation-delay:var(--love-delay);
  }

  .wl-back {
    position:fixed; top:24px; left:28px; z-index:50;
    display:inline-flex; align-items:center; justify-content:center;
    width:44px; height:44px;
    border:1px solid rgba(107,62,30,.18); border-radius:8px;
    background:rgba(255,255,255,.72); color:${BROWN};
    box-shadow:0 14px 34px rgba(107,62,30,.08); text-decoration:none;
  }

  .wl-shell {
    width:min(500px, calc(100% - 40px));
    margin:0 auto;
    padding:88px 0 72px;
  }

  .wl-heading { text-align:center; margin-bottom:16px; }
  .wl-kicker {
    margin-bottom:12px; color:${BROWN};
    font-size:11px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
  }
  .wl-heading h1 {
    margin-bottom:10px; color:${RED};
    font-family:${INTER_REGULAR};
    font-size:clamp(2rem,5vw,3rem);
    font-weight:400; letter-spacing:-0.03em; line-height:1.05;
  }
  .wl-heading h1 span { color:${BROWN}; }
  .wl-heading p {
    max-width:380px; margin:0 auto;
    color:rgba(116,130,63,.72); font-size:14px; line-height:1.65;
  }

  /* Love row */
  .love-row {
    display:flex; align-items:center; justify-content:center;
    gap:10px; flex-wrap:wrap; margin:12px 0 14px;
  }
  .love-button {
    display:inline-flex; align-items:center; gap:7px; height:38px;
    border:1px solid rgba(107,62,30,.18); border-radius:999px;
    background:rgba(255,255,255,.72); color:${BROWN};
    cursor:pointer; font-family:inherit; font-size:13px; font-weight:700;
    padding:0 16px; transition:background .18s, color .18s, transform .18s;
  }
  .love-button:hover { transform:translateY(-1px); }
  .love-button.is-loved { background:${BROWN}; color:${CREAM}; }
  .love-button:disabled { cursor:default; transform:none; }
  .love-count { color:rgba(116,130,63,.6); font-size:13px; font-weight:600; }

  /* Role pill toggle */
  .role-toggle {
    display:inline-flex; align-items:center;
    background:rgba(255,255,255,.6);
    border:1px solid rgba(116,130,63,.14);
    border-radius:999px; padding:4px; gap:2px;
    box-shadow:0 2px 12px rgba(116,130,63,.08);
    margin-bottom:20px;
  }
  .role-toggle button {
    height:36px; padding:0 26px; min-width:90px;
    border:0; border-radius:999px; background:transparent;
    color:rgba(116,130,63,.58); cursor:pointer; font-family:inherit;
    font-size:14px; font-weight:600; text-align:center;
    transition:background .2s, color .2s, box-shadow .2s; white-space:nowrap;
  }
  .role-toggle button.is-active {
    background:${RED}; color:${CREAM};
    box-shadow:0 4px 14px rgba(116,130,63,.22);
  }

  /* Fields */
  .wl-fields { display:flex; flex-direction:column; gap:10px; margin-bottom:12px; }

  .wl-field {
    width:100%; height:52px;
    border:1.5px solid rgba(116,130,63,.16); border-radius:12px;
    background:${FIELD_BG}; color:${RED};
    box-sizing:border-box; font-family:inherit; font-size:15px;
    outline:none; padding:0 18px;
    transition:border-color .18s, box-shadow .18s;
  }
  .wl-field:focus {
    border-color:rgba(116,130,63,.44);
    box-shadow:0 0 0 3px rgba(116,130,63,.12);
  }
  .wl-field::placeholder { color:rgba(116,130,63,.42); }

  .wl-select-wrap { position:relative; }
  .wl-select-wrap .wl-chevron {
    position:absolute; right:16px; top:50%;
    transform:translateY(-50%); pointer-events:none;
    color:rgba(107,62,30,.5);
  }
  select.wl-field {
    appearance:none; color:rgba(116,130,63,.5); font-weight:500; cursor:pointer; padding-right:44px;
  }
  select.wl-field.has-value { color:${RED}; }
  select.wl-field option { background:${FIELD_BG}; color:${RED}; font-weight:400; }

  .wl-handle-wrap { position:relative; }
  .wl-handle-at {
    position:absolute; left:18px; top:50%; transform:translateY(-50%);
    color:rgba(107,62,30,.44); font-size:15px; font-weight:700; pointer-events:none;
  }
  .wl-handle-wrap .wl-field { padding-left:34px; }

  /* Creator slot - always in DOM, visibility toggled to preserve height */
  .creator-slot { transition:opacity .18s; }
  .creator-slot.hidden { visibility:hidden; pointer-events:none; opacity:0; }

  /* Submit */
  .wl-submit {
    display:inline-flex; align-items:center; justify-content:center; gap:8px;
    width:100%; height:52px; border:0; border-radius:12px;
    background:${RED}; color:${CREAM};
    cursor:pointer; font-family:inherit; font-size:15px; font-weight:700;
    transition:opacity .18s, transform .18s;
  }
  .wl-submit:hover { opacity:.9; transform:translateY(-1px); }
  .wl-submit:disabled { opacity:.6; cursor:not-allowed; transform:none; }

  .wl-error { margin-top:10px; color:#b8473e; font-size:13px; text-align:center; }
  .wl-success {
    margin-top:10px; border:1px solid rgba(116,130,63,.14); border-radius:10px;
    background:rgba(116,130,63,.06); color:${RED};
    font-size:14px; font-weight:600; line-height:1.5; padding:12px 16px; text-align:center;
  }
  .wl-note { margin-top:12px; color:rgba(107,62,30,.44); font-size:12px; text-align:center; }

  @media (max-width:640px) {
    .wl-back { top:18px; left:18px; }
    .wl-shell {
      padding-top: 80px;
      padding-bottom: 48px;
    }
    .wl-heading h1 {
      font-size: clamp(1.9rem, 9vw, 2.4rem);
    }
    .wl-heading p {
      font-size: 14px;
    }
    .love-row {
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .role-toggle {
      width: 100%;
      justify-content: stretch;
    }
    .role-toggle button {
      flex: 1;
      padding: 0 12px;
      font-size: 13px;
    }
    .wl-field {
      height: 50px;
      font-size: 16px; /* prevents iOS zoom */
    }
    .wl-submit {
      height: 50px;
      font-size: 15px;
    }
    .wl-note {
      font-size: 11px;
    }
  }
`;

type Role = "user" | "creator";

export default function WaitlistPage() {
  const [role, setRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [instagram, setInstagram] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [loveCount, setLoveCount] = useState(DEFAULT_LOVE_COUNT);
  const [hasLoved, setHasLoved] = useState(false);
  const [isLoveSaving, setIsLoveSaving] = useState(false);
  const [lovePopKey, setLovePopKey] = useState(0);
  const isCreator = role === "creator";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("role") === "creator") setRole("creator");
    if (window.localStorage.getItem("ateoclock-loved") === "true") setHasLoved(true);
    let ignore = false;
    fetch("/api/love")
      .then(async (res) => {
        if (!res.ok) return;
        const data = (await res.json()) as { count?: unknown };
        if (!ignore && typeof data.count === "number") setLoveCount(data.count);
      })
      .catch(() => { if (!ignore) setLoveCount(DEFAULT_LOVE_COUNT); });
    return () => { ignore = true; };
  }, []);

  async function handleLoveClick() {
    if (isLoveSaving) return;
    setLovePopKey((k) => k + 1);
    if (hasLoved) return;
    const prev = loveCount;
    setIsLoveSaving(true);
    setHasLoved(true);
    setLoveCount(loveCount + 1);
    window.localStorage.setItem("ateoclock-loved", "true");
    try {
      const res = await fetch("/api/love", { method: "POST" });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { count?: unknown };
      if (typeof data.count === "number") setLoveCount(data.count);
    } catch {
      setHasLoved(false);
      setLoveCount(prev);
      window.localStorage.removeItem("ateoclock-loved");
    } finally {
      setIsLoveSaving(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const body: Record<string, string> = { email, role, country };
      if (isCreator && instagram) body.instagram_url = instagram;
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <GridBackground
      patternId="waitlist-grid"
      style={{
        minHeight: "100vh",
        background: `radial-gradient(circle at 82% 12%, rgba(166,95,45,.11), transparent 34%),
          linear-gradient(180deg, rgba(255,255,255,.5), rgba(255,255,255,.12)),
          ${CREAM}`,
        color: RED,
        fontFamily: "var(--font-inter), sans-serif",
      }}
    >
      <style>{STYLES}</style>

      {/* Hearts burst */}
      {lovePopKey > 0 && (
        <div className="love-burst" key={`burst-${lovePopKey}`} aria-hidden="true">
          {Array.from({ length: 22 }).map((_, i) => (
            <Heart
              className="love-burst-heart"
              fill="currentColor"
              key={i}
              size={18 + (i % 4) * 5}
              strokeWidth={2.2}
              style={{
                "--love-delay": `${i * 160}ms`,
                "--love-left":  `${6 + ((i * 17) % 88)}%`,
                "--love-scale": 0.72 + (i % 6) * 0.1,
                "--love-x":     `${i % 2 === 0 ? 10 + i * 1.4 : -8 - i}vw`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      <Link href="/" replace prefetch={false} className="wl-back" aria-label="Back">
        <ArrowLeft size={20} strokeWidth={2.4} />
      </Link>

      <main className="wl-shell">
        {/* Heading */}
        <div className="wl-heading">
          <div className="wl-kicker">Early access</div>
          <h1>
            {isCreator
              ? <>Creator <span>early access.</span></>
              : <>Secure your <span>spot.</span></>}
          </h1>
          <p>
            {isCreator
              ? "Tell us where you create. We'll send creator access details before launch."
              : "Early access is opening soon. We'll reach out when ateoclock goes live."}
          </p>
        </div>

        {/* Love */}
        <div className="love-row">
          <button
            type="button"
            className={`love-button${hasLoved ? " is-loved" : ""}`}
            onClick={handleLoveClick}
            aria-pressed={hasLoved}
            disabled={isLoveSaving}
          >
            <Heart size={15} strokeWidth={2.4} fill={hasLoved ? "currentColor" : "none"} />
            {hasLoved ? "Loved" : "Love this idea"}
          </button>
          <span className="love-count">{loveCount.toLocaleString()} people love this</span>
        </div>

        {/* Role toggle */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="role-toggle" role="group" aria-label="I am a">
            {(["user", "creator"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={role === r}
                className={role === r ? "is-active" : undefined}
                onClick={() => setRole(r)}
              >
                {r === "user" ? "User" : "Creator"}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="wl-fields">
            {/* Email */}
            <input
              className="wl-field"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={status === "loading" || status === "success"}
              autoComplete="email"
            />

            {/* Country */}
            <div className="wl-select-wrap">
              <select
                className={`wl-field${country ? " has-value" : ""}`}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                disabled={status === "loading" || status === "success"}
              >
                <option value="" disabled>Where are you based?</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="wl-chevron" size={16} strokeWidth={2.2} />
            </div>

            {/* Creator handle - always rendered, hidden via visibility to keep height */}
            <div className={`creator-slot wl-handle-wrap${isCreator ? "" : " hidden"}`}>
              <span className="wl-handle-at">@</span>
              <input
                className="wl-field"
                type="text"
                placeholder="instagram or portfolio link"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                disabled={!isCreator || status === "loading" || status === "success"}
                tabIndex={isCreator ? 0 : -1}
              />
            </div>
          </div>

          {/* Submit - always at bottom */}
          <button
            className="wl-submit"
            type="submit"
            disabled={status === "loading" || status === "success"}
          >
            {status === "success"
              ? "You're in!"
              : status === "loading"
              ? "Joining…"
              : "Join waitlist"}
            {status !== "success" && status !== "loading" && <SendHorizonal size={16} strokeWidth={2} />}
          </button>

          {status === "error" && (
            <p className="wl-error">Something went wrong. Please try again.</p>
          )}
          {status === "success" && (
            <p className="wl-success">
              You&rsquo;re on the list. We&rsquo;ll be in touch when ateoclock opens early access.
            </p>
          )}
          <p className="wl-note">No spam. Unsubscribe any time.</p>
        </form>
      </main>
    </GridBackground>
  );
}
