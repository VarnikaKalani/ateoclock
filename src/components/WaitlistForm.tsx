"use client";

import { useState } from "react";

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

const RED = "#962d49";
const CREAM = "#f3eac3";

type Role = "user" | "creator";
type Status = "idle" | "loading" | "success" | "error";

export default function WaitlistForm({ dark = false }: { dark?: boolean }) {
  const [role, setRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [expanded, setExpanded] = useState(false);

  const bg = dark ? "rgba(255,255,255,0.07)" : "#fff";
  const border = `1.5px solid rgba(150,45,73,0.15)`;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!expanded) { setExpanded(true); return; }
    setStatus("loading");
    try {
      const body: Record<string, string> = { email, role, country };
      if (role === "creator" && instagramUrl) body.instagram_url = instagramUrl;
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

  if (status === "success") {
    return (
      <p style={{ fontSize: 14, fontWeight: 600, color: "#3a9e6f", padding: "12px 0" }}>
        You&apos;re on the list — we&apos;ll be in touch. 🎉
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 420 }}>
      {/* Step 1: email + role + button in one row */}
      <div style={{
        display: "flex",
        background: bg,
        border,
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 2px 12px rgba(150,45,73,0.08)",
        marginBottom: expanded ? 10 : 0,
      }}>
        {/* Role pill */}
        <button
          type="button"
          onClick={() => setRole(r => r === "user" ? "creator" : "user")}
          style={{
            flexShrink: 0,
            padding: "0 14px",
            background: "transparent",
            border: "none",
            borderRight: border,
            cursor: "pointer",
            fontSize: 11,
            fontWeight: 700,
            color: RED,
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            fontFamily: "inherit",
          }}
          title="Toggle role"
        >
          {role === "user" ? "User ↕" : "Creator ↕"}
        </button>

        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Your email"
          required
          disabled={status === "loading"}
          style={{
            flex: 1,
            padding: "14px 14px",
            border: "none",
            background: "transparent",
            fontSize: 14,
            color: dark ? "#fff" : RED,
            outline: "none",
            fontFamily: "inherit",
            minWidth: 0,
          }}
        />

        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            flexShrink: 0,
            padding: "0 20px",
            background: status === "loading" ? "rgba(150,45,73,0.7)" : RED,
            color: CREAM,
            border: "none",
            fontSize: 13,
            fontWeight: 700,
            cursor: status === "loading" ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
            fontFamily: "inherit",
            transition: "background 0.2s",
          }}
        >
          {status === "loading" ? "…" : expanded ? "Join →" : "Join →"}
        </button>
      </div>

      {/* Step 2: extra fields shown after focus */}
      {expanded && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {role === "creator" && (
            <input
              type="url"
              value={instagramUrl}
              onChange={e => setInstagramUrl(e.target.value)}
              placeholder="Instagram URL"
              disabled={status === "loading"}
              style={{
                width: "100%",
                padding: "11px 14px",
                border,
                borderRadius: 10,
                background: bg,
                fontSize: 13,
                color: dark ? "#fff" : RED,
                outline: "none",
                fontFamily: "inherit",
                boxSizing: "border-box",
              }}
            />
          )}
          <select
            value={country}
            onChange={e => setCountry(e.target.value)}
            required
            disabled={status === "loading"}
            style={{
              width: "100%",
              padding: "11px 14px",
              border,
              borderRadius: 10,
              background: bg,
              fontSize: 13,
              color: country ? (dark ? "#fff" : RED) : "rgba(150,45,73,0.4)",
              outline: "none",
              appearance: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              boxSizing: "border-box",
            }}
          >
            <option value="" disabled>Country</option>
            {COUNTRIES.map(c => (
              <option key={c} value={c} style={{ color: RED }}>{c}</option>
            ))}
          </select>
        </div>
      )}

      {status === "error" && (
        <p style={{ fontSize: 12, color: "#e05252", marginTop: 8 }}>
          Something went wrong — try again.
        </p>
      )}
    </form>
  );
}
