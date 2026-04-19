import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

const UPDATED = "April 17, 2026";
const CONTACT_EMAIL = "ateoclock.app@gmail.com";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | ateoclock",
  description:
    "Affiliate disclosure for ateoclock grocery links, creator smart links, commissions, and creator revenue sharing.",
};

const sections: LegalSection[] = [
  {
    title: "Some Links Generate Commission",
    shortTitle: "Commission Links",
    body: (
      <>
        <p>
          Some grocery, product, creator, or checkout links on ate o&apos;clock may
          be affiliate links or tracked links. If you buy through those links, the
          platform may earn revenue from the purchase.
        </p>
      </>
    ),
  },
  {
    title: "No Extra Cost to You",
    shortTitle: "No Extra Cost",
    body: (
      <>
        <p>
          Affiliate or tracking links do not add an extra fee charged by ate
          o&apos;clock. Final product prices, taxes, delivery fees, handling fees,
          discounts, and platform charges are set by the third-party grocery or
          commerce platform.
        </p>
      </>
    ),
  },
  {
    title: "Platform and Creator Revenue",
    shortTitle: "Revenue Share",
    body: (
      <>
        <p>
          ate o&apos;clock may receive a commission, referral fee, marketing fee, or
          other revenue when eligible purchases are made through tracked links.
        </p>
        <p>
          When a creator participates in a creator program, that creator may earn
          a share of eligible revenue connected to their recipe, smart link, or
          content.
        </p>
      </>
    ),
  },
  {
    title: "Third-Party Platforms Set Their Own Terms",
    shortTitle: "Third Parties",
    body: (
      <>
        <p>
          Grocery and commerce platforms are independent third parties. They decide
          product availability, prices, delivery times, cancellation rules, refund
          rules, commission eligibility, and final order terms.
        </p>
      </>
    ),
  },
  {
    title: "Questions",
    body: (
      <>
        <p>
          Questions about this disclosure can be sent to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
];

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage
      patternId="affiliate-grid"
      title="Affiliate Disclosure"
      updated={UPDATED}
      intro={
        <p>
          This disclosure explains how ate o&apos;clock and creators may earn from
          tracked grocery and checkout links while keeping the final purchase
          decision with the user.
        </p>
      }
      sections={sections}
    />
  );
}
