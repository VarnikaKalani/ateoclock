"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandWordmark } from "@/components/site-logo";
import PillMorphTabs from "@/components/ui/pill-morph-tabs";

const NAV_LINKS = [
  { label: "About", href: "/team" },
  { label: "Features", href: "/#features" },
  { label: "For Creators", href: "/#creators" },
  { label: "FAQs", href: "/#faq" },
];

function getActiveHref(pathname: string, hash = "") {
  if (pathname === "/team") return "/team";
  if (pathname !== "/") return "";

  const sectionHref = `/${hash}`;
  return NAV_LINKS.some((link) => link.href === sectionHref) ? sectionHref : "";
}

export function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHref, setActiveHref] = useState(() => getActiveHref(pathname));

  useEffect(() => {
    const syncActiveHref = () => setActiveHref(getActiveHref(pathname, window.location.hash));

    syncActiveHref();
    window.addEventListener("hashchange", syncActiveHref);
    window.addEventListener("popstate", syncActiveHref);

    return () => {
      window.removeEventListener("hashchange", syncActiveHref);
      window.removeEventListener("popstate", syncActiveHref);
    };
  }, [pathname]);

  function navigateTo(href: string) {
    setActiveHref(href);
    setMenuOpen(false);

    if (typeof window === "undefined") return;

    if (href.startsWith("/#") && pathname === "/") {
      const target = document.getElementById(href.slice(2));
      if (target) {
        window.history.pushState(null, "", href);
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
    }

    if (href === pathname) return;

    window.location.assign(href);
  }

  return (
    <div className="sticky top-0 z-[100] px-5 py-2">
      <nav
        className="mx-auto max-w-[1180px] rounded-xl border border-[rgba(116,130,63,.08)] bg-[rgba(255,255,255,.68)] shadow-[rgba(0,0,0,0.14)_0px_0.6px_0.6px_-1.25px,rgba(0,0,0,0.1)_0px_2.3px_2.3px_-2.5px,rgba(0,0,0,0.04)_0px_10px_10px_-3.75px] backdrop-blur"
        aria-label="Site navigation"
      >
        <div className="flex h-12 items-center justify-between px-[18px]">
          <Link
            href="/"
            className="inline-flex items-baseline rounded-lg no-underline outline-offset-[6px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#74823F]/45"
            aria-label="ate o'clock home"
          >
            <BrandWordmark size={21} />
          </Link>

          <div className="absolute left-1/2 hidden -translate-x-1/2 min-[861px]:flex">
            <PillMorphTabs
              value={activeHref}
              items={NAV_LINKS.map((link) => ({
                value: link.href,
                label: link.label,
                panel: null,
              }))}
              defaultValue=""
              onValueChange={navigateTo}
            />
          </div>

          <Link
            href="/waitlist"
            onClick={() => setMenuOpen(false)}
            className="hidden shrink-0 rounded-full bg-[#74823F] px-[18px] py-2 text-xs font-bold text-[#F1E8C7] no-underline transition-opacity hover:opacity-85 min-[861px]:inline-flex"
          >
            Get Started
          </Link>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-[38px] items-center justify-center rounded-lg border border-[#74823F]/20 bg-white px-3.5 text-xs font-bold text-[#74823F] min-[861px]:hidden"
          >
            {menuOpen ? "Close" : "Menu"}
          </button>
        </div>

        {menuOpen && (
          <div id="site-mobile-menu" className="flex flex-col gap-2 px-[18px] pb-3.5 min-[861px]:hidden">
            {NAV_LINKS.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => navigateTo(link.href)}
                className={`bg-transparent py-1 text-left text-[13px] font-semibold text-[#74823F] ${
                  activeHref === link.href ? "opacity-100" : "opacity-75"
                }`}
              >
                {link.label}
              </button>
            ))}
            <Link
              href="/waitlist"
              onClick={() => setMenuOpen(false)}
              className="mt-0.5 block w-full rounded-lg bg-[#74823F] px-3.5 py-2.5 text-center text-[13px] font-bold text-[#F1E8C7] no-underline"
            >
              Get Started
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
}
