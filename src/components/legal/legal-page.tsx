import type { ReactNode } from "react";
import Link from "next/link";
import { GridBackground } from "@/components/ui/grid-background";
import { SiteFooter } from "@/components/site-footer";

const GREEN = "#74823F";
const CREAM = "#F1E8C7";
const BROWN = "#6B3E1E";
const INTER = "var(--font-inter), sans-serif";

export type LegalSection = {
  title: string;
  shortTitle?: string;
  id?: string;
  body: ReactNode;
};

type LegalPageProps = {
  patternId: string;
  title: string;
  kicker?: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
};

const LEGAL_STYLES = `
  .legal-nav-wrap {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 8px 20px;
  }

  .legal-nav {
    max-width: 1180px;
    margin: 0 auto;
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    border: 1px solid rgba(116,130,63,.1);
    border-radius: 8px;
    box-shadow: rgba(0,0,0,0.12) 0 1px 2px, rgba(0,0,0,0.06) 0 8px 20px;
  }

  .legal-nav-inner {
    min-height: 52px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 18px;
    padding: 0 18px;
  }

  .legal-nav-logo {
    font-size: 21px;
    font-weight: 800;
    letter-spacing: -0.5px;
    text-decoration: none;
    display: inline-flex;
    align-items: baseline;
    gap: 1px;
    white-space: nowrap;
  }

  .legal-nav-links {
    display: flex;
    gap: 2px;
    align-items: center;
  }

  .legal-nav-link {
    padding: 7px 17px;
    border-radius: 999px;
    color: ${GREEN};
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    font-family: ${INTER};
    opacity: .75;
    transition: opacity .15s, color .15s;
  }

  .legal-nav-link:hover {
    opacity: 1;
    color: ${BROWN};
  }

  .legal-nav-cta {
    padding: 8px 14px;
    border-radius: 8px;
    background: ${GREEN};
    color: ${CREAM};
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    flex-shrink: 0;
    transition: opacity .15s;
  }

  .legal-nav-cta:hover {
    opacity: .88;
  }

  .legal-shell {
    width: min(1120px, calc(100% - 40px));
    margin: 0 auto;
    padding: 54px 0 100px;
  }

  .legal-hero {
    max-width: none;
    padding-bottom: 32px;
  }

  .legal-kicker {
    margin-bottom: 12px;
    color: ${BROWN};
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0;
    text-transform: uppercase;
  }

  .legal-title {
    margin-bottom: 12px;
    color: ${GREEN};
    font-family: ${INTER};
    font-size: 2.5rem;
    font-weight: 700;
    line-height: 1.08;
    letter-spacing: 0;
  }

  .legal-date {
    color: rgba(116,130,63,.64);
    font-size: 14px;
    margin-bottom: 20px;
  }

  .legal-intro,
  .legal-section-body p,
  .legal-section-body li {
    color: rgba(90,62,28,.86);
    font-size: 15px;
    line-height: 1.74;
    font-family: ${INTER};
  }

  .legal-intro {
    max-width: none;
  }

  .legal-layout {
    display: block;
  }

  .legal-content {
    min-width: 0;
    width: 100%;
  }

  .legal-section {
    display: grid;
    grid-template-columns: minmax(160px, 220px) minmax(0, 1fr);
    gap: 32px;
    padding: 30px 0;
    border-top: 1px solid rgba(116,130,63,.18);
    align-items: start;
  }

  .legal-section:first-child {
    border-top-color: rgba(116,130,63,.28);
  }

  .legal-section-heading {
    min-width: 0;
  }

  .legal-section-index {
    display: block;
    margin-bottom: 8px;
    color: rgba(116,130,63,.55);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0;
  }

  .legal-section h2 {
    color: ${BROWN};
    font-family: ${INTER};
    font-size: 15px;
    font-weight: 800;
    line-height: 1.35;
    letter-spacing: 0;
    text-transform: uppercase;
    overflow-wrap: anywhere;
  }

  .legal-section-body {
    min-width: 0;
  }

  .legal-section-body p,
  .legal-section-body ul,
  .legal-section-body ol {
    margin-bottom: 12px;
  }

  .legal-section-body ul,
  .legal-section-body ol {
    padding-left: 20px;
  }

  .legal-section-body li {
    margin-bottom: 8px;
    padding-left: 2px;
  }

  .legal-section-body strong {
    color: ${BROWN};
    font-weight: 800;
  }

  .legal-section-body a {
    color: ${GREEN};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .legal-note {
    margin-top: 18px;
    padding-left: 16px;
    border-left: 3px solid rgba(116,130,63,.32);
  }

  @media (max-width: 860px) {
    .legal-shell {
      width: min(760px, calc(100% - 32px));
      padding: 42px 0 76px;
    }

    .legal-title {
      font-size: 2rem;
    }

    .legal-section {
      grid-template-columns: 1fr;
      gap: 12px;
      padding: 24px 0;
    }
  }

  @media (max-width: 700px) {
    .legal-nav-links {
      display: none;
    }
  }

  @media (max-width: 520px) {
    .legal-nav-wrap {
      padding: 8px 12px;
    }

    .legal-nav,
    .legal-shell {
      width: min(358px, calc(100vw - 24px));
      max-width: min(358px, calc(100vw - 24px));
    }

    .legal-nav-inner {
      padding: 0 12px;
      gap: 10px;
    }

    .legal-nav-cta {
      max-width: 92px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .legal-title {
      font-size: 1.78rem;
    }
  }
`;

const navLinks = [
  { label: "About", href: "/team" },
  { label: "Features", href: "/#features" },
  { label: "For Creators", href: "/#creators" },
  { label: "FAQs", href: "/#faq" },
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function formatIndex(index: number) {
  return String(index + 1).padStart(2, "0");
}

export function LegalPage({
  patternId,
  title,
  kicker = "Legal",
  updated,
  intro,
  sections,
}: LegalPageProps) {
  const sectionsWithIds = sections.map((section) => ({
    ...section,
    id: section.id ?? slugify(section.title),
  }));

  return (
    <GridBackground
      patternId={patternId}
      style={{ minHeight: "100vh", background: CREAM, color: GREEN, fontFamily: INTER }}
    >
      <style>{LEGAL_STYLES}</style>

      <div className="legal-nav-wrap">
        <nav className="legal-nav" aria-label="Legal page navigation">
          <div className="legal-nav-inner">
            <Link href="/" className="legal-nav-logo" aria-label="ate o'clock home">
              <span style={{ color: GREEN }}>ate</span>
              <span style={{ color: BROWN }}> o&apos;clock</span>
            </Link>
            <div className="legal-nav-links">
              {navLinks.map((link) => (
                <Link key={link.label} href={link.href} className="legal-nav-link">
                  {link.label}
                </Link>
              ))}
            </div>
            <Link href="/waitlist" className="legal-nav-cta">
              Get Started
            </Link>
          </div>
        </nav>
      </div>

      <main className="legal-shell">
        <header className="legal-hero">
          <p className="legal-kicker">{kicker}</p>
          <h1 className="legal-title">{title}</h1>
          <p className="legal-date">Last updated: {updated}</p>
          <div className="legal-intro">{intro}</div>
        </header>

        <div className="legal-layout">
          <div className="legal-content">
            {sectionsWithIds.map((section, index) => (
              <section key={section.id} id={section.id} className="legal-section">
                <div className="legal-section-heading">
                  <span className="legal-section-index">{formatIndex(index)}</span>
                  <h2>{section.title}</h2>
                </div>
                <div className="legal-section-body">{section.body}</div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </GridBackground>
  );
}
