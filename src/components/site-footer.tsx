const CREAM = "#F1E8C7";
const BROWN = "#6B3E1E";
const INTER = "var(--font-inter), sans-serif";

const FOOTER_CSS = `
  .sf-footer {
    background: ${BROWN};
    color: ${CREAM};
    padding: 104px 28px 54px;
  }
  .sf-shell {
    max-width: 1180px;
    margin: 0 auto;
  }
  .sf-main {
    display: grid;
    grid-template-columns: minmax(280px, 1fr) minmax(420px, .9fr);
    gap: 120px;
    align-items: start;
    margin-bottom: 54px;
  }
  .sf-logo {
    display: inline-flex;
    align-items: baseline;
    gap: 1px;
    margin-bottom: 42px;
    color: ${CREAM};
    font-size: 34px;
    font-weight: 800;
    letter-spacing: .18em;
    line-height: 1;
    text-transform: uppercase;
  }
  .sf-logo span:last-child { color: rgba(241,232,199,.72); }
  .sf-brand p {
    max-width: 360px;
    color: rgba(241,232,199,.72);
    font-size: 18px;
    line-height: 1.55;
  }
  .sf-brand .sf-socials { margin-top: 28px; }
  .sf-links {
    display: grid;
    grid-template-columns: repeat(2, minmax(160px, 1fr));
    gap: 72px;
  }
  .sf-group {
    display: grid;
    gap: 18px;
    align-content: start;
  }
  .sf-group + .sf-group { margin-top: 42px; }
  .sf-footer h3 {
    color: ${CREAM};
    font-family: ${INTER};
    font-size: 22px;
    font-weight: 400;
    letter-spacing: 0;
    margin-bottom: 4px;
  }
  .sf-footer a {
    color: rgba(241,232,199,.72);
    text-decoration: none;
    transition: color .18s ease;
  }
  .sf-footer a:hover { color: ${CREAM}; }
  .sf-socials {
    display: flex;
    flex-wrap: wrap;
    gap: 22px;
  }
  .sf-socials a {
    display: flex;
    align-items: center;
    gap: 9px;
    color: ${CREAM};
    font-size: 14px;
    font-weight: 800;
  }
  .sf-socials a:hover { opacity: .82; }
  .sf-join-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-top: 18px;
    min-height: 42px;
    padding: 0 20px;
    border-radius: 8px;
    background: ${CREAM};
    color: ${BROWN} !important;
    font-size: 13px;
    font-weight: 800;
    white-space: nowrap;
    text-decoration: none;
  }
  .sf-join-btn:hover { opacity: .86; color: ${BROWN} !important; }
  .sf-bottom {
    display: grid;
    gap: 18px;
    justify-items: center;
    color: rgba(241,232,199,.62);
    font-size: 14px;
    line-height: 1.6;
    text-align: center;
  }
  @media (max-width: 1100px) {
    .sf-main { grid-template-columns: 1fr; gap: 54px; margin-bottom: 54px; }
    .sf-links { gap: 36px; }
  }
  @media (max-width: 640px) {
    .sf-footer { padding: 72px 18px 42px; }
    .sf-logo { margin-bottom: 28px; font-size: 28px; }
    .sf-links { grid-template-columns: 1fr; }
    .sf-socials a { min-height: auto; }
  }
  @media (max-width: 480px) {
    .sf-links { grid-template-columns: 1fr; }
    .sf-group + .sf-group { margin-top: 30px; }
    .sf-socials { flex-direction: column; }
  }
`;

function Ig({ s = 17 }: { s?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={s} viewBox="0 0 24 24" width={s}>
      <rect height="16" rx="5" stroke="currentColor" strokeWidth="2" width="16" x="4" y="4" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" fill="currentColor" r="1.1" />
    </svg>
  );
}

function Ss({ s = 18 }: { s?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={s} viewBox="0 0 24 24" width={s}>
      <path d="M5 5h14M5 9h14M6 13h12v7l-6-3.2L6 20v-7Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function Yt({ s = 20 }: { s?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={s} viewBox="0 0 24 24" width={s}>
      <rect height="12" rx="3.2" stroke="currentColor" strokeWidth="2" width="18" x="3" y="6" />
      <path d="M11 10.2v3.6l3.4-1.8L11 10.2Z" fill="currentColor" />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <>
      <style>{FOOTER_CSS}</style>
      <footer className="sf-footer">
        <div className="sf-shell">
          <div className="sf-main">
            <div className="sf-brand">
              <div className="sf-logo" aria-label="ate o'clock">
                <span>ate</span><span> o&apos;clock</span>
              </div>
              <p>Saved recipes, grocery carts, and creator earnings in one place.</p>
              <div className="sf-socials" aria-label="Social links">
                <a href="https://www.instagram.com/ateoclock.app/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Ig /><span>Instagram</span>
                </a>
                <a href="https://substack.com/@ateoclock" target="_blank" rel="noopener noreferrer" aria-label="Substack">
                  <Ss /><span>Substack</span>
                </a>
                <a href="#" aria-label="YouTube">
                  <Yt /><span>YouTube</span>
                </a>
              </div>
              <a href="/waitlist" className="sf-join-btn">Join waitlist</a>
            </div>

            <div className="sf-links" aria-label="Footer navigation">
              <div className="sf-group">
                <h3>Product</h3>
                <a href="/#features">Features</a>
                <a href="/#creators">For Creators</a>
                <a href="/#faq">FAQs</a>
              </div>
              <div>
                <div className="sf-group">
                  <h3>Legal</h3>
                  <a href="/terms">Terms of Use</a>
                  <a href="/privacy">Privacy Policy</a>
                  <a href="/affiliate-disclosure">Affiliate Disclosure</a>
                  <a href="/disclaimer">Disclaimer</a>
                </div>
                <div className="sf-group">
                  <h3>About</h3>
                  <a href="/team">Meet the Team</a>
                </div>
              </div>
            </div>
          </div>

          <div className="sf-bottom">
            <p>&#169; 2026 ateoclock. All rights reserved.</p>
            <a href="mailto:ateoclock.app@gmail.com">ateoclock.app@gmail.com</a>
          </div>
        </div>
      </footer>
    </>
  );
}
