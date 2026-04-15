"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { GridBackground } from "@/components/ui/grid-background";
import { Fragment } from "react";

const CREAM = "#F1E8C7";
const BROWN = "#6B3E1E";
const RED   = "#74823F";
const INTER = "var(--font-inter), sans-serif";

const P: React.CSSProperties = {
  color: "rgba(241,232,199,.68)",
  fontSize: 16,
  lineHeight: 1.75,
  fontFamily: INTER,
  marginBottom: 0,
  maxWidth: 520,
};

const STYLES = `
  .cr-shell {
    width: min(1100px, calc(100% - 48px));
    margin: 0 auto;
    padding: 96px 0 100px;
    display: grid;
    grid-template-columns: 1fr minmax(340px, 480px);
    gap: 64px;
    align-items: center;
  }
  .cr-copy { display: flex; flex-direction: column; gap: 0; }
  .cr-kicker {
    font-size: 11px; font-weight: 800; letter-spacing: .14em;
    text-transform: uppercase; color: rgba(241,232,199,.44);
    margin-bottom: 18px;
  }
  .cr-heading {
    font-size: clamp(2rem, 3.5vw, 3rem);
    font-weight: 400; letter-spacing: -.03em; line-height: 1.06;
    color: ${CREAM}; margin-bottom: 20px; font-family: ${INTER};
  }
  .cr-steps {
    display: flex; align-items: center; gap: 8px;
    margin: 32px 0 36px; flex-wrap: nowrap;
  }
  .cr-step { display: flex; align-items: center; gap: 10px; }
  .cr-step-num {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1.5px solid rgba(241,232,199,.22);
    display: flex; align-items: center; justify-content: center;
    color: rgba(241,232,199,.5); font-size: 10px; font-weight: 800;
    letter-spacing: .06em; flex-shrink: 0;
  }
  .cr-step strong { display: block; color: ${CREAM}; font-size: 13px; font-weight: 700; line-height: 1.3; }
  .cr-step span   { display: block; color: rgba(241,232,199,.46); font-size: 11px; font-weight: 500; margin-top: 2px; }
  .cr-step-arrow  { color: rgba(241,232,199,.22); font-size: 18px; flex-shrink: 0; }
  .cr-cta {
    display: inline-flex; align-items: center; gap: 8px;
    height: 50px; padding: 0 28px; border-radius: 999px;
    background: ${CREAM}; color: ${BROWN};
    font-size: 15px; font-weight: 700; text-decoration: none;
    transition: opacity .18s; width: fit-content;
  }
  .cr-cta:hover { opacity: .88; }

  /* Earn card */
  .cr-card {
    border-radius: 20px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(241,232,199,.1);
    backdrop-filter: blur(12px);
    padding: 32px 32px 28px;
    box-shadow: 0 0 0 1px rgba(241,232,199,.04) inset, 0 40px 80px rgba(0,0,0,.18);
  }
  .cr-card-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    gap: 16px; margin-bottom: 32px;
  }
  .cr-card-label {
    color: rgba(241,232,199,.44); font-size: 11px; font-weight: 700;
    letter-spacing: .12em; text-transform: uppercase; margin-bottom: 6px;
  }
  .cr-card-amount {
    color: ${CREAM}; font-family: ${INTER};
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 400; letter-spacing: -.02em; line-height: 1;
  }
  .cr-card-badge {
    display: inline-flex; align-items: center; height: 28px; padding: 0 12px;
    border-radius: 999px; background: rgba(116,130,63,.28);
    color: rgba(241,232,199,.82); font-size: 12px; font-weight: 700;
    white-space: nowrap; flex-shrink: 0;
  }
  .cr-card-rows { display: flex; flex-direction: column; gap: 22px; }
  .cr-card-row-top {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 12px; margin-bottom: 4px;
  }
  .cr-card-row strong { color: ${CREAM}; font-size: 14px; font-weight: 700; }
  .cr-card-row-earn  { color: rgba(241,232,199,.7); font-size: 13px; font-weight: 600; }
  .cr-card-row-meta  { color: rgba(241,232,199,.38); font-size: 11px; font-weight: 600; margin-bottom: 8px; }
  .cr-card-track {
    height: 4px; border-radius: 2px;
    background: rgba(241,232,199,.08);
  }
  .cr-card-fill { height: 100%; border-radius: 2px; background: rgba(241,232,199,.28); }
  .cr-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    gap: 12px; margin-top: 28px; padding-top: 20px;
    border-top: 1px solid rgba(241,232,199,.08);
  }
  .cr-card-footer span { color: rgba(241,232,199,.38); font-size: 12px; font-weight: 600; }
  .cr-card-footer strong { color: rgba(241,232,199,.7); font-size: 12px; font-weight: 700; }

  @media (max-width: 760px) {
    .cr-shell {
      grid-template-columns: 1fr;
      gap: 40px;
      padding: 88px 0 72px;
    }
    .cr-steps { flex-wrap: wrap; }
    .cr-heading { font-size: 1.85rem; }
  }
`;

const STEPS = [
  { n: "01", label: "Share", sub: "Post your recipe link" },
  { n: "02", label: "Shop",  sub: "Followers order groceries" },
  { n: "03", label: "Earn",  sub: "Payout lands in your account" },
];

const ROWS = [
  { recipe: "Butter Chicken", orders: "142 orders", pct: 86, earn: "Rs 1,340" },
  { recipe: "Pizza",          orders: "61 orders",  pct: 48, earn: "Rs 890" },
  { recipe: "Acai Bowl",      orders: "48 orders",  pct: 36, earn: "Rs 610" },
];

export default function CreatorsPage() {
  return (
    <GridBackground
      patternId="creators-grid"
      style={{ minHeight: "100vh", background: BROWN, color: CREAM, fontFamily: INTER }}
    >
      <style>{STYLES}</style>

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
          border: "1px solid rgba(241,232,199,.18)", borderRadius: 8,
          background: "rgba(255,255,255,.08)", color: CREAM,
          boxShadow: "0 14px 34px rgba(0,0,0,.14)", textDecoration: "none",
        }}
      >
        <ArrowLeft size={20} strokeWidth={2.4} />
      </Link>

      <div className="cr-shell">
        {/* Left — copy */}
        <div className="cr-copy">
          <p className="cr-kicker">For creators</p>
          <h1 className="cr-heading">Earn when your audience shops your recipes.</h1>
          <p style={P}>
            Share one ate o&apos;clock link. When followers buy groceries through your recipe,
            you earn from every eligible order.
          </p>

          <div className="cr-steps">
            {STEPS.map(({ n, label, sub }, i) => (
              <Fragment key={n}>
                <div className="cr-step">
                  <div className="cr-step-num">{n}</div>
                  <div>
                    <strong>{label}</strong>
                    <span>{sub}</span>
                  </div>
                </div>
                {i < STEPS.length - 1 && <div className="cr-step-arrow">→</div>}
              </Fragment>
            ))}
          </div>

          <Link href="/waitlist?role=creator" className="cr-cta">
            Get creator access <ArrowRight size={16} strokeWidth={2.4} />
          </Link>
        </div>

        {/* Right — earnings card */}
        <div className="cr-card" aria-label="Creator earnings demo">
          <div className="cr-card-header">
            <div>
              <div className="cr-card-label">Last 7 days</div>
              <div className="cr-card-amount">Rs 4,096</div>
            </div>
            <div className="cr-card-badge">↑ 18% this week</div>
          </div>

          <div className="cr-card-rows">
            {ROWS.map(({ recipe, orders, pct, earn }) => (
              <div className="cr-card-row" key={recipe}>
                <div className="cr-card-row-top">
                  <strong>{recipe}</strong>
                  <span className="cr-card-row-earn">{earn}</span>
                </div>
                <div className="cr-card-row-meta">{orders}</div>
                <div className="cr-card-track">
                  <div className="cr-card-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="cr-card-footer">
            <span>Eligible grocery payout</span>
            <strong>Paid every Monday</strong>
          </div>
        </div>
      </div>
    </GridBackground>
  );
}
