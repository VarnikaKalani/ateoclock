"use client";

import { useState } from "react";

const RED = "#962d49";
const CREAM = "#f3eac3";
const BG = "#fdf8f5";
const FIELD_BG = "#f0ebe8";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Argentina", "Australia", "Austria",
  "Bangladesh", "Belgium", "Brazil", "Canada", "Chile", "China", "Colombia",
  "Croatia", "Czech Republic", "Denmark", "Egypt", "Ethiopia", "Finland",
  "France", "Germany", "Ghana", "Greece", "Hungary", "India", "Indonesia",
  "Iran", "Iraq", "Ireland", "Israel", "Italy", "Japan", "Jordan", "Kenya",
  "Malaysia", "Mexico", "Morocco", "Netherlands", "New Zealand", "Nigeria",
  "Norway", "Pakistan", "Peru", "Philippines", "Poland", "Portugal",
  "Romania", "Russia", "Saudi Arabia", "Singapore", "South Africa",
  "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland", "Taiwan",
  "Thailand", "Turkey", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Vietnam", "Zimbabwe",
];

type Role = "user" | "creator";

export default function WaitlistPage() {
  const [role, setRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [instagram, setInstagram] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const body: Record<string, string> = { email, role, country };
      if (role === "creator" && instagram) body.instagram_url = instagram;
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

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "16px 18px",
    border: "none",
    borderRadius: 14,
    background: FIELD_BG,
    fontSize: 15,
    color: RED,
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: RED,
    opacity: 0.45,
    marginBottom: 8,
    display: "block",
  };

  if (status === "success") {
    return (
      <div style={{ minHeight: "100vh", background: BG, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', system-ui, sans-serif", color: RED, textAlign: "center", padding: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>
        <h1 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 12 }}>You&apos;re in.</h1>
        <p style={{ fontSize: 16, opacity: 0.55, maxWidth: 380, lineHeight: 1.7, marginBottom: 32 }}>
          We&apos;ll reach out before launch. Keep an eye on your inbox.
        </p>
        <a href="/" style={{ padding: "13px 28px", background: RED, color: CREAM, borderRadius: 12, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
          Back to home
        </a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'Inter', system-ui, sans-serif", color: RED }}>

      {/* Nav */}
      <nav style={{ padding: "22px 36px" }}>
        <a href="/" style={{ textDecoration: "none", fontWeight: 800, fontSize: 18, color: RED, letterSpacing: "-0.04em", opacity: 0.85 }}>
          ← Coookd
        </a>
      </nav>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 32px 80px", textAlign: "center" }}>

        {/* Heading */}
        <h1 style={{ fontSize: "clamp(2.4rem,5vw,3.4rem)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1, marginBottom: 16 }}>
          Secure your spot.
        </h1>
        <p style={{ fontSize: 16, opacity: 0.5, lineHeight: 1.7, marginBottom: 48, maxWidth: 440, margin: "0 auto 48px" }}>
          Early access is opening soon. Tell us who you are and we&apos;ll reach out the moment we&apos;re live.
        </p>

        <form onSubmit={handleSubmit}>

          {/* Role toggle */}
          <div style={{ display: "inline-flex", background: FIELD_BG, borderRadius: 999, padding: 5, marginBottom: 36, gap: 4 }}>
            {(["user", "creator"] as Role[]).map(r => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                style={{
                  padding: "10px 28px",
                  borderRadius: 999,
                  border: "none",
                  fontFamily: "inherit",
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.18s",
                  background: role === r ? "#fff" : "transparent",
                  color: RED,
                  opacity: role === r ? 1 : 0.4,
                  boxShadow: role === r ? "0 2px 10px rgba(150,45,73,0.12)" : "none",
                }}
              >
                {r === "user" ? "User" : "Creator"}
              </button>
            ))}
          </div>

          {/* Email + Location row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16, textAlign: "left" }}>
            <div>
              <label style={labelStyle}>Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="gourmet@example.com"
                required
                disabled={status === "loading"}
                style={fieldStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Location</label>
              <select
                value={country}
                onChange={e => setCountry(e.target.value)}
                required
                disabled={status === "loading"}
                style={{ ...fieldStyle, appearance: "none", cursor: "pointer", color: country ? RED : "rgba(150,45,73,0.35)" }}
              >
                <option value="" disabled>Country</option>
                {COUNTRIES.map(c => (
                  <option key={c} value={c} style={{ color: RED }}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Instagram — creators only */}
          {role === "creator" && (
            <div style={{ marginBottom: 16, textAlign: "left" }}>
              <label style={labelStyle}>Instagram / Portfolio URL</label>
              <div style={{ position: "relative" }}>
                <span style={{ position: "absolute", left: 18, top: "50%", transform: "translateY(-50%)", fontSize: 14, opacity: 0.35, fontWeight: 600 }}>@</span>
                <input
                  type="text"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="yourusername"
                  disabled={status === "loading"}
                  style={{ ...fieldStyle, paddingLeft: 36 }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading"}
            style={{
              width: "100%",
              padding: "18px",
              background: status === "loading" ? "rgba(150,45,73,0.65)" : RED,
              color: CREAM,
              border: "none",
              borderRadius: 16,
              fontWeight: 700,
              fontSize: 15,
              cursor: status === "loading" ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "background 0.2s",
              marginTop: 8,
              letterSpacing: "0.01em",
            }}
          >
            {status === "loading" ? "Submitting…" : "Submit Request"}
          </button>

          {status === "error" && (
            <p style={{ fontSize: 13, color: "#e05252", textAlign: "center", marginTop: 12 }}>
              Something went wrong — try again.
            </p>
          )}

          <p style={{ fontSize: 12, opacity: 0.25, marginTop: 18 }}>
            No spam. Unsubscribe any time.
          </p>
        </form>
      </div>
    </div>
  );
}
