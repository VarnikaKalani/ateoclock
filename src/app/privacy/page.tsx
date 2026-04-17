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

export default function PrivacyPage() {
  return (
    <GridBackground
      patternId="privacy-grid"
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
        <h1 className="legal-title">Privacy Policy</h1>
        <p className="legal-date">Last updated: April 2025</p>

        <div className="legal-section">
          <p>
            ateoclock (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) is committed to protecting your privacy. This policy explains what information we collect when you interact with our website and waitlist, and how we use it.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>1. Information We Collect</h2>
          <p>When you join our waitlist or interact with our site, we may collect:</p>
          <ul>
            <li><strong>Email address</strong> — to notify you about early access and product updates.</li>
            <li><strong>Country</strong> — to understand where our community is based.</li>
            <li><strong>Instagram or portfolio link</strong> — for creators who opt in, to help us understand your audience and content.</li>
            <li><strong>Usage data</strong> — standard web analytics such as pages visited, device type, and referring URL. This data is aggregated and not linked to you personally.</li>
          </ul>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Send you early access invitations and product announcements.</li>
            <li>Understand the size and location of our waitlist community.</li>
            <li>Improve the website and user experience.</li>
            <li>Respond to your questions or requests if you contact us.</li>
          </ul>
          <p>We do not sell, rent, or share your personal information with third parties for their marketing purposes.</p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>3. Data Storage &amp; Security</h2>
          <p>
            Your data is stored securely using industry-standard infrastructure. We retain your information only for as long as necessary to fulfil the purposes described in this policy or as required by law.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>4. Cookies &amp; Analytics</h2>
          <p>
            We may use cookies or similar tracking technologies to understand how visitors use our site. You can disable cookies in your browser settings; this will not affect your ability to browse the site.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Request access to the personal data we hold about you.</li>
            <li>Ask us to correct or delete your data.</li>
            <li>Unsubscribe from our emails at any time using the link in any email we send.</li>
          </ul>
          <p>To exercise any of these rights, email us at <a href="mailto:hello@ateoclock.app">hello@ateoclock.app</a>.</p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>6. Third-Party Services</h2>
          <p>
            We use trusted third-party services (such as hosting and email providers) that may process your data on our behalf. These providers are contractually obligated to handle your data securely and only for the purposes we specify.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>7. Children&rsquo;s Privacy</h2>
          <p>
            Our service is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with their information, please contact us and we will delete it.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>8. Changes to This Policy</h2>
          <p>
            We may update this policy from time to time. When we do, we will update the &ldquo;last updated&rdquo; date at the top of this page. Continued use of the site after changes constitutes acceptance of the revised policy.
          </p>
        </div>

        <hr className="legal-divider" />

        <div className="legal-section">
          <h2>9. Contact</h2>
          <p>
            If you have any questions about this Privacy Policy, please reach out at <a href="mailto:hello@ateoclock.app">hello@ateoclock.app</a>.
          </p>
        </div>
      </div>
    </GridBackground>
  );
}
