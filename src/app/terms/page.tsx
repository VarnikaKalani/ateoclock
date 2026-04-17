"use client";

import { GridBackground } from "@/components/ui/grid-background";

const RED   = "#74823F";
const CREAM = "#F1E8C7";
const BROWN = "#6B3E1E";
const INTER = "var(--font-inter), sans-serif";

const STYLES = `
  .legal-nav-wrap {
    position:sticky; top:0; z-index:100; padding:8px 20px;
  }
  .legal-nav {
    max-width:1180px; margin:0 auto;
    background:rgba(255,255,255,0.68);
    backdrop-filter:blur(8px); -webkit-backdrop-filter:blur(8px);
    border:1px solid rgba(116,130,63,.08); border-radius:12px;
    box-shadow:rgba(0,0,0,0.14) 0px 0.6px 0.6px -1.25px,rgba(0,0,0,0.1) 0px 2.3px 2.3px -2.5px,rgba(0,0,0,0.04) 0px 10px 10px -3.75px;
  }
  .legal-nav-inner {
    height:48px; display:flex; align-items:center; justify-content:space-between; padding:0 18px;
  }
  .legal-nav-logo {
    font-size:21px; font-weight:800; letter-spacing:-0.5px; text-decoration:none; display:inline-flex; align-items:baseline; gap:1px;
  }
  .legal-nav-links {
    display:flex; gap:2px; align-items:center;
  }
  .legal-nav-link {
    padding:7px 17px; border-radius:999px; color:#74823F; font-size:14px; font-weight:600;
    text-decoration:none; font-family:var(--font-inter),sans-serif; opacity:0.75; transition:opacity .15s;
  }
  .legal-nav-link:hover { opacity:1; }
  .legal-nav-cta {
    padding:8px 18px; border-radius:999px; background:#74823F; color:#F1E8C7;
    font-size:12px; font-weight:700; text-decoration:none; flex-shrink:0; transition:opacity .15s;
  }
  .legal-nav-cta:hover { opacity:0.85; }
  @media (max-width:700px) {
    .legal-nav-links { display:none; }
  }

  .legal-shell {
    width:min(720px, calc(100% - 40px));
    margin:0 auto;
    padding:48px 0 100px;
  }
  .legal-kicker {
    margin-bottom:10px; color:${BROWN};
    font-size:11px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
  }
  .legal-title {
    margin-bottom:8px; color:${RED};
    font-family:${INTER};
    font-size:clamp(1.5rem,2.8vw,1.9rem);
    font-weight:400; line-height:1.1; letter-spacing:-0.025em;
  }
  .legal-date {
    color:rgba(116,130,63,.52); font-size:13px; margin-bottom:40px;
  }
  .legal-section {
    margin-bottom:36px;
  }
  .legal-section h2 {
    color:${BROWN};
    font-family:${INTER};
    font-size:15px;
    font-weight:700;
    letter-spacing:.04em;
    text-transform:uppercase;
    margin-bottom:12px;
  }
  .legal-section p, .legal-section li {
    color:rgba(90,62,28,.82);
    font-size:15px;
    line-height:1.78;
    font-family:${INTER};
    margin-bottom:10px;
  }
  .legal-section ul {
    padding-left:20px;
    margin-bottom:10px;
  }
  .legal-section a {
    color:${RED};
    text-decoration:underline;
  }
  .legal-divider {
    border:none;
    border-top:1px solid rgba(116,130,63,.12);
    margin:32px 0;
  }
  @media (max-width:640px) {
    .legal-shell { padding:36px 0 64px; }
  }
`;

export default function TermsPage() {
  return (
    <GridBackground
      patternId="terms-grid"
      style={{ minHeight: "100vh", background: CREAM, color: RED, fontFamily: INTER }}
    >
      <style>{STYLES}</style>

      <div className="legal-nav-wrap">
        <nav className="legal-nav">
          <div className="legal-nav-inner">
            <a href="/" className="legal-nav-logo">
              <span style={{ color: RED }}>ate</span><span style={{ color: BROWN }}> o&apos;clock</span>
            </a>
            <div className="legal-nav-links">
              {[
                { label: "About",        href: "/team" },
                { label: "Features",     href: "/#features" },
                { label: "For Creators", href: "/#creators" },
                { label: "FAQs",         href: "/#faq" },
              ].map(l => (
                <a key={l.label} href={l.href} className="legal-nav-link">{l.label}</a>
              ))}
            </div>
            <a href="/waitlist" className="legal-nav-cta">Get Started</a>
          </div>
        </nav>
      </div>

      <div className="legal-shell">
        <p className="legal-kicker">Legal</p>
        <h1 className="legal-title">Terms of Use</h1>
        <p className="legal-date">Last updated: April 2025</p>

        <div className="legal-section">
          <p>
            Welcome to ateoclock. By accessing or using our website at <a href="https://ateoclock.vercel.app">ateoclock.vercel.app</a> (the &ldquo;Site&rdquo;), you agree to be bound by these Terms of Use. If you do not agree, please do not use the Site.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>1. About the Service</h2>
          <p>
            ateoclock is a food platform in early development that connects recipe creators with their audiences, enabling users to discover recipes and build grocery lists. The Site currently operates as an early access waitlist. Features described on the Site are subject to change before launch.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>2. Eligibility</h2>
          <p>
            You must be at least 13 years old to use this Site. By using the Site, you represent that you meet this requirement.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>3. Waitlist &amp; Early Access</h2>
          <p>
            Joining the waitlist does not guarantee early access or a place in the product. We reserve the right to determine who receives access and when. We will not share your waitlist information with third parties for their marketing purposes.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>4. Acceptable Use</h2>
          <p>When using the Site, you agree not to:</p>
          <ul>
            <li>Submit false, misleading, or fraudulent information.</li>
            <li>Attempt to gain unauthorised access to any part of the Site or its infrastructure.</li>
            <li>Use automated tools to scrape, crawl, or extract data from the Site without our written permission.</li>
            <li>Use the Site in any way that violates applicable laws or regulations.</li>
          </ul>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>5. Intellectual Property</h2>
          <p>
            All content on this Site — including text, graphics, logos, illustrations, and code — is owned by or licensed to ateoclock and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>6. Disclaimer of Warranties</h2>
          <p>
            The Site is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without warranties of any kind, either express or implied. We do not warrant that the Site will be uninterrupted, error-free, or free of viruses or other harmful components. Features and availability may change at any time without notice.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by law, ateoclock and its founders shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of, or inability to use, the Site.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>8. Links to Third-Party Sites</h2>
          <p>
            The Site may contain links to third-party websites. These links are provided for convenience only. We have no control over the content or practices of third-party sites and accept no responsibility for them.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>9. Changes to These Terms</h2>
          <p>
            We may update these Terms from time to time. Changes take effect when posted on this page. Your continued use of the Site after any changes constitutes your acceptance of the new Terms.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>10. Governing Law</h2>
          <p>
            These Terms are governed by and construed in accordance with applicable law. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the relevant courts.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>11. Contact</h2>
          <p>
            If you have any questions about these Terms, please contact us at <a href="mailto:hello@ateoclock.app">hello@ateoclock.app</a>.
          </p>
        </div>
      </div>
    </GridBackground>
  );
}
