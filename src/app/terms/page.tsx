import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

const UPDATED = "April 17, 2026";
const CONTACT_EMAIL = "ateoclock.app@gmail.com";

export const metadata: Metadata = {
  title: "Terms of Use | ateoclock",
  description:
    "Terms for using ateoclock, including recipe carts, grocery checkout, creator smart links, affiliate links, and acceptable use.",
};

const sections: LegalSection[] = [
  {
    title: "Core Contract",
    body: (
      <>
        <p>
          These Terms are the core contract between you and ate o&apos;clock. By
          accessing the website, joining the waitlist, using recipe links, or using
          any checkout-related features, you agree to these Terms.
        </p>
        <p>
          If you do not agree with these Terms, do not use the service.
        </p>
      </>
    ),
  },
  {
    title: "What ate o'clock Does",
    shortTitle: "What We Do",
    body: (
      <>
        <p>
          ate o&apos;clock helps turn recipes into grocery actions. A user can
          save or open a recipe, review an ingredient cart, adjust items, and
          continue to checkout on a supported grocery platform.
        </p>
        <p>
          The service may support creator recipe pages, smart links, ingredient
          matching, cart preparation, grocery store comparison, and links to
          external checkout pages. Features may change as the product develops.
        </p>
      </>
    ),
  },
  {
    title: "User Responsibilities",
    body: (
      <>
        <p>
          You are responsible for the recipe links, recipe details, preferences,
          serving sizes, ingredient selections, substitutions, and checkout choices
          you provide or approve.
        </p>
        <p>
          You are also responsible for personal dietary decisions. This includes
          checking allergies, nutrition, ingredient suitability, religious or
          cultural food restrictions, medical restrictions, and household safety
          before buying, cooking, or eating anything.
        </p>
      </>
    ),
  },
  {
    title: "External Platforms",
    body: (
      <>
        <p>
          Grocery platforms such as Blinkit, Zepto, Instamart, Amazon Fresh,
          BigBasket, and similar services are third-party platforms. They are not
          owned or controlled by ate o&apos;clock.
        </p>
        <p>
          When you continue to a third-party platform, that platform&apos;s own
          terms, privacy policy, pricing, delivery rules, refund rules, customer
          support, and payment processes apply.
        </p>
      </>
    ),
  },
  {
    title: "Availability, Pricing, and Delivery",
    shortTitle: "Availability",
    body: (
      <>
        <p>
          We do not guarantee that any ingredient, product, grocery platform,
          price, delivery slot, discount, fee, or delivery estimate will be
          available when you check out.
        </p>
        <p>
          Grocery information can change quickly. You should review the final cart,
          item details, taxes, fees, delivery time, and total price on the
          third-party platform before placing an order.
        </p>
      </>
    ),
  },
  {
    title: "Affiliate Disclosure",
    body: (
      <>
        <p>
          Some links from ate o&apos;clock may be affiliate links or tracked links.
          If you purchase through those links, ate o&apos;clock may earn a
          commission at no extra cost to you.
        </p>
        <p>
          Where a creator participates in a creator or affiliate program, that
          creator may earn a share of eligible revenue from purchases connected to
          their recipe or smart link.
        </p>
      </>
    ),
  },
  {
    title: "Account Rules and Acceptable Use",
    shortTitle: "Account Rules",
    body: (
      <>
        <p>You agree not to misuse the service. This means you must not:</p>
        <ul>
          <li>Submit false, misleading, unlawful, or fraudulent information.</li>
          <li>Scrape, crawl, copy, or extract data without written permission.</li>
          <li>Send spam, fake traffic, automated clicks, or abusive requests.</li>
          <li>Interfere with the security, availability, or performance of the service.</li>
          <li>Use the service in a way that violates applicable law or third-party rights.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Creator Terms",
    body: (
      <>
        <p>
          If you upload, submit, connect, or publish recipe content as a creator,
          you keep ownership of your recipe content, subject to any rights held by
          third-party platforms or other creators.
        </p>
        <p>
          You give ate o&apos;clock permission to host, display, process, format,
          analyze, and use your submitted recipe content to provide recipe pages,
          ingredient carts, checkout functionality, analytics, support, and related
          product features.
        </p>
        <p>
          Commission structures, eligibility rules, payout methods, and payout
          timelines can change. Unless a separate written agreement says otherwise,
          eligible creator payouts are expected within 30 days after the relevant
          purchase is confirmed, reported by the partner platform, and no longer
          subject to cancellation, refund, fraud review, or chargeback.
        </p>
        <p>
          Fake traffic, self-dealing, misleading recipes, copied content, bot
          activity, manipulated clicks, or other fraud may lead to withheld
          commissions, removal from creator tools, or account suspension.
        </p>
      </>
    ),
  },
  {
    title: "Intellectual Property",
    shortTitle: "IP",
    body: (
      <>
        <p>
          The ate o&apos;clock website, product design, software, branding, text,
          graphics, and other materials are owned by or licensed to ate o&apos;clock
          and are protected by intellectual property laws.
        </p>
        <p>
          Recipe content, creator content, grocery catalog data, images, brand
          names, logos, and platform content may belong to the relevant creators,
          grocery platforms, brands, licensors, or other rights holders.
        </p>
      </>
    ),
  },
  {
    title: "Disclaimer",
    body: (
      <>
        <p>
          Recipes may be user-generated, creator-provided, imported from links, or
          processed automatically. We do not guarantee that recipe text, ingredient
          matching, quantities, nutritional information, cooking instructions, or
          dietary labels are complete, accurate, safe, or suitable for you.
        </p>
        <p>
          You are responsible for reviewing all recipe, ingredient, allergy,
          nutrition, grocery, and checkout information before relying on it.
        </p>
      </>
    ),
  },
  {
    title: "Limitation of Liability",
    shortTitle: "Liability",
    body: (
      <>
        <p>
          To the fullest extent permitted by law, ate o&apos;clock and its team will
          not be liable for indirect, incidental, special, consequential, exemplary,
          or punitive damages, or for lost profits, lost revenue, lost data, food
          issues, order issues, delivery issues, or third-party platform actions.
        </p>
        <p>
          The service is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
          basis. We do not promise that the service will be uninterrupted,
          error-free, secure, or available at all times.
        </p>
      </>
    ),
  },
  {
    title: "Termination Rights",
    shortTitle: "Termination",
    body: (
      <>
        <p>
          We may suspend, restrict, or terminate access to the service, creator
          tools, commissions, or waitlist participation if we believe there has
          been misuse, fraud, legal risk, security risk, or violation of these
          Terms.
        </p>
      </>
    ),
  },
  {
    title: "Changes to These Terms",
    shortTitle: "Changes",
    body: (
      <>
        <p>
          We may update these Terms as the service changes. The updated version
          takes effect when posted on this page. Your continued use of the service
          after changes are posted means you accept the updated Terms.
        </p>
      </>
    ),
  },
  {
    title: "Governing Law",
    body: (
      <>
        <p>
          These Terms are governed by the laws of India. Courts in India will have
          jurisdiction over disputes relating to these Terms, unless applicable law
          requires otherwise.
        </p>
      </>
    ),
  },
  {
    title: "Contact",
    body: (
      <>
        <p>
          Questions about these Terms can be sent to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      patternId="terms-grid"
      title="Terms of Use"
      updated={UPDATED}
      intro={
        <p>
          These Terms explain how ate o&apos;clock works, what users and creators
          are responsible for, how third-party grocery platforms fit in, and the
          limits that apply when recipe content becomes an ingredient cart and
          checkout flow.
        </p>
      }
      sections={sections}
    />
  );
}
