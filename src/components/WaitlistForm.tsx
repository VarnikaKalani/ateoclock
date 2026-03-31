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

type Role = "user" | "creator";

export default function WaitlistForm({ dark = false }: { dark?: boolean }) {
  const [role, setRole] = useState<Role>("user");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const inputStyle = {
    width: "100%",
    padding: "13px 16px",
    border: `1.5px solid ${dark ? "rgba(232,213,190,0.3)" : "var(--color-sand-dark)"}`,
    borderRadius: "8px",
    background: dark ? "rgba(255,255,255,0.08)" : "var(--color-warm-white)",
    fontFamily: "var(--font-sans)",
    fontSize: "0.95rem",
    color: dark ? "#fff" : "var(--color-text)",
    outline: "none",
    boxSizing: "border-box" as const,
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const body: Record<string, string> = { email, role, country };
      if (role === "creator" && instagramUrl) {
        body.instagram_url = instagramUrl;
      }
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
      <p
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: dark ? "#6ee7a0" : "var(--color-green-light)",
          textAlign: "center",
          padding: "16px 0",
        }}
      >
        You&apos;re on the list! We&apos;ll be in touch soon. 🎉
      </p>
    );
  }

  const toggleBase: React.CSSProperties = {
    flex: 1,
    padding: "10px 0",
    border: `1.5px solid ${dark ? "rgba(232,213,190,0.4)" : "var(--color-sand-dark)"}`,
    borderRadius: "8px",
    fontFamily: "var(--font-sans)",
    fontSize: "0.92rem",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.18s, color 0.18s",
  };

  const activeToggle: React.CSSProperties = {
    ...toggleBase,
    background: "var(--color-orange)",
    color: "#fff",
    border: "1.5px solid var(--color-orange)",
  };

  const inactiveToggle: React.CSSProperties = {
    ...toggleBase,
    background: dark ? "rgba(255,255,255,0.06)" : "var(--color-warm-white)",
    color: dark ? "rgba(255,255,255,0.6)" : "var(--color-text)",
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "420px", margin: "0 auto", width: "100%" }}>
      {/* Role toggle */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "14px",
        }}
      >
        <button
          type="button"
          onClick={() => setRole("user")}
          style={role === "user" ? activeToggle : inactiveToggle}
        >
          I&apos;m a User
        </button>
        <button
          type="button"
          onClick={() => setRole("creator")}
          style={role === "creator" ? activeToggle : inactiveToggle}
        >
          I&apos;m a Creator
        </button>
      </div>

      {/* Email */}
      <div style={{ marginBottom: "12px" }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={status === "loading"}
          style={inputStyle}
        />
      </div>

      {/* Instagram URL — creators only */}
      {role === "creator" && (
        <div style={{ marginBottom: "12px" }}>
          <input
            type="url"
            value={instagramUrl}
            onChange={(e) => setInstagramUrl(e.target.value)}
            placeholder="Instagram profile URL (e.g. instagram.com/yourhandle)"
            disabled={status === "loading"}
            style={inputStyle}
          />
        </div>
      )}

      {/* Country */}
      <div style={{ marginBottom: "16px" }}>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          disabled={status === "loading"}
          style={{
            ...inputStyle,
            appearance: "none" as const,
            cursor: "pointer",
            color: country ? (dark ? "#fff" : "var(--color-text)") : (dark ? "rgba(255,255,255,0.4)" : "#aaa"),
          }}
        >
          <option value="" disabled>
            Where are you from?
          </option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c} style={{ color: "var(--color-text)" }}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "loading"}
        style={{
          width: "100%",
          background: status === "loading" ? "var(--color-orange-dark)" : "var(--color-orange)",
          color: "#fff",
          border: "none",
          padding: "15px 28px",
          borderRadius: "8px",
          fontFamily: "var(--font-sans)",
          fontSize: "0.95rem",
          fontWeight: 600,
          cursor: status === "loading" ? "not-allowed" : "pointer",
          transition: "background 0.2s",
        }}
      >
        {status === "loading" ? "Joining…" : "Join the waitlist"}
      </button>

      {status === "error" && (
        <p
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "0.82rem",
            color: "#e05252",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          Something went wrong — try again.
        </p>
      )}
    </form>
  );
}
