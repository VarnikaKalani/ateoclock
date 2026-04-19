import Link from "next/link";

import { BrandWordmark } from "@/components/site-logo";

function InstagramGlyph({ size = 17 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <rect height="16" rx="5" stroke="currentColor" strokeWidth="2" width="16" x="4" y="4" />
      <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17" cy="7" fill="currentColor" r="1.1" />
    </svg>
  );
}

function SubstackGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg aria-hidden="true" fill="none" height={size} viewBox="0 0 24 24" width={size}>
      <path
        d="M5 5h14M5 9h14M6 13h12v7l-6-3.2L6 20v-7Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#6B3E1E] px-7 pb-[54px] pt-[104px] text-[#F1E8C7] max-[640px]:px-[18px] max-[640px]:pb-[42px] max-[640px]:pt-[72px]">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-[54px] grid grid-cols-[minmax(280px,1fr)_minmax(420px,.9fr)] items-start gap-[120px] max-[980px]:grid-cols-1 max-[980px]:gap-[54px]">
          <div>
            <div className="mb-10">
              <BrandWordmark size={34} tone="light" />
            </div>
            <p className="max-w-[360px] text-lg leading-[1.55] text-[#F1E8C7]/75">
              Saved recipes, grocery carts, and creator earnings in one place.
            </p>
            <div className="mt-7 flex flex-wrap gap-[22px] max-[480px]:flex-col max-[480px]:items-start max-[480px]:gap-4" aria-label="Social links">
              <a
                href="https://www.instagram.com/ateoclock.app/"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[9px] text-sm font-extrabold text-[#F1E8C7] no-underline hover:opacity-85"
              >
                <InstagramGlyph size={17} />
                <span>Instagram</span>
              </a>
              <a
                href="https://substack.com/@ateoclock"
                aria-label="Substack"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-[9px] text-sm font-extrabold text-[#F1E8C7] no-underline hover:opacity-85"
              >
                <SubstackGlyph size={18} />
                <span>Substack</span>
              </a>
            </div>
            <Link
              href="/waitlist"
              className="mt-[18px] inline-flex min-h-[42px] items-center justify-center rounded-lg bg-[#F1E8C7] px-5 text-[13px] font-extrabold text-[#6B3E1E] no-underline hover:opacity-85"
            >
              Join waitlist
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-[72px] max-[980px]:gap-9 max-[480px]:grid-cols-1 max-[480px]:gap-[30px]" aria-label="Footer navigation">
            <div className="grid content-start gap-[18px]">
              <h3 className="mb-1 text-[22px] font-normal tracking-normal text-[#F1E8C7]">Product</h3>
              <Link className="text-[#F1E8C7]/75 no-underline hover:text-[#F1E8C7]" href="/#features">Features</Link>
              <Link className="text-[#F1E8C7]/75 no-underline hover:text-[#F1E8C7]" href="/#creators">For Creators</Link>
              <Link className="text-[#F1E8C7]/75 no-underline hover:text-[#F1E8C7]" href="/#faq">FAQs</Link>
            </div>

            <div>
              <div className="grid content-start gap-[18px]">
                <h3 className="mb-1 text-[22px] font-normal tracking-normal text-[#F1E8C7]">Legal</h3>
                <Link className="text-[#F1E8C7]/75 no-underline hover:text-[#F1E8C7]" href="/terms">Terms of Use</Link>
                <Link className="text-[#F1E8C7]/75 no-underline hover:text-[#F1E8C7]" href="/privacy">Privacy Policy</Link>
                <Link className="text-[#F1E8C7]/75 no-underline hover:text-[#F1E8C7]" href="/affiliate-disclosure">Affiliate Disclosure</Link>
                <Link className="text-[#F1E8C7]/75 no-underline hover:text-[#F1E8C7]" href="/disclaimer">Disclaimer</Link>
              </div>
              <div className="mt-[42px] grid content-start gap-[18px] max-[480px]:mt-[30px]">
                <h3 className="mb-1 text-[22px] font-normal tracking-normal text-[#F1E8C7]">About</h3>
                <Link className="text-[#F1E8C7]/75 no-underline hover:text-[#F1E8C7]" href="/team">Meet the Team</Link>
              </div>
            </div>
          </div>
        </div>

        <div className="grid justify-items-center gap-[18px] text-center text-sm leading-[1.6] text-[#F1E8C7]/65">
          <p>&#169; 2026 ateoclock. All rights reserved.</p>
          <a className="text-[#F1E8C7]/65 no-underline hover:text-[#F1E8C7]" href="mailto:ateoclock.app@gmail.com">
            ateoclock.app@gmail.com
          </a>
        </div>
      </div>
    </footer>
  );
}
