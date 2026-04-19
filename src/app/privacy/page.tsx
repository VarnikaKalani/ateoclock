import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

const UPDATED = "April 17, 2026";
const CONTACT_EMAIL = "ateoclock.app@gmail.com";

export const metadata: Metadata = {
  title: "Privacy Policy | ateoclock",
  description:
    "Privacy policy for ateoclock, including email collection, recipe links, analytics, cookies, Supabase, data storage, and privacy requests.",
};

const sections: LegalSection[] = [
  {
    title: "What This Policy Covers",
    shortTitle: "Scope",
    body: (
      <>
        <p>
          This Privacy Policy explains how ate o&apos;clock collects, uses, stores,
          and shares information when you visit the website, join the waitlist,
          submit recipe links, use recipe-to-cart features, or interact with
          creator tools.
        </p>
      </>
    ),
  },
  {
    title: "Data We Collect",
    body: (
      <>
        <p>We collect the information needed to run and improve the service:</p>
        <ul>
          <li>
            <strong>Email address</strong> - for waitlist access, account access,
            product updates, and privacy or support responses.
          </li>
          <li>
            <strong>Waitlist and creator details</strong> - such as role, country,
            Instagram handle, creator links, or other details you choose to submit.
          </li>
          <li>
            <strong>Recipe information</strong> - recipe links, recipe text,
            ingredients, cart edits, serving choices, store choices, and related
            checkout activity.
          </li>
          <li>
            <strong>Usage analytics</strong> - pages visited, buttons clicked,
            device and browser information, approximate location, referrer, and
            interaction events.
          </li>
          <li>
            <strong>Technical data</strong> - IP address, logs, error reports,
            security events, and diagnostics.
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "Why We Collect Data",
    body: (
      <>
        <p>We use data for the following purposes:</p>
        <ul>
          <li>To operate the waitlist, accounts, recipe tools, and creator tools.</li>
          <li>To convert recipes into ingredient carts and checkout flows.</li>
          <li>To improve product quality, performance, usability, and reliability.</li>
          <li>To understand feature usage through analytics.</li>
          <li>To prevent spam, scraping, fraud, abuse, and security incidents.</li>
          <li>To respond to support, legal, and privacy requests.</li>
        </ul>
      </>
    ),
  },
  {
    title: "Cookies and Tracking Tools",
    shortTitle: "Cookies",
    body: (
      <>
        <p>
          We use cookies, local storage, and similar technologies to keep the site
          working, remember basic preferences, measure usage, and understand how
          people interact with the product.
        </p>
        <p>
          We use or may use analytics tools such as PostHog or similar services.
          These tools can collect interaction events, device information, page
          views, referrers, and approximate location data.
        </p>
        <p>
          You can control cookies through your browser settings. Blocking some
          cookies or storage may affect parts of the service.
        </p>
      </>
    ),
  },
  {
    title: "Third-Party Services",
    body: (
      <>
        <p>
          We use third-party service providers to run the product. These may
          include Supabase for database and authentication infrastructure, hosting
          providers, analytics providers, email tools, error monitoring tools, and
          grocery or affiliate partners.
        </p>
        <p>
          When you click through to a grocery platform such as Blinkit, Zepto,
          Instamart, Amazon Fresh, BigBasket, or another partner, that platform may
          collect and process your data under its own privacy policy.
        </p>
      </>
    ),
  },
  {
    title: "Data Storage Location",
    shortTitle: "Storage",
    body: (
      <>
        <p>
          We store data using Supabase and other service providers. Data may be
          stored or processed in India and in other countries where our providers
          operate infrastructure or support teams.
        </p>
        <p>
          If we choose a fixed storage region or materially change where data is
          stored, we will update this policy.
        </p>
      </>
    ),
  },
  {
    title: "How We Share Data",
    shortTitle: "Sharing",
    body: (
      <>
        <p>
          We do not sell your personal information. We may share information with
          service providers that help us operate the product, comply with law,
          prevent abuse, process affiliate attribution, or complete a user-requested
          checkout flow.
        </p>
        <p>
          We may share aggregated or de-identified analytics that do not reasonably
          identify you.
        </p>
      </>
    ),
  },
  {
    title: "Retention",
    body: (
      <>
        <p>
          We keep personal data only for as long as needed for the purposes in this
          policy, including waitlist management, product access, analytics, legal
          compliance, fraud prevention, and support.
        </p>
        <p>
          If you ask us to delete your data, we will delete or anonymize it unless
          we need to keep limited information for legal, security, fraud prevention,
          or accounting reasons.
        </p>
      </>
    ),
  },
  {
    title: "Your Rights",
    body: (
      <>
        <p>You can ask us to:</p>
        <ul>
          <li>Confirm whether we hold personal data about you.</li>
          <li>Provide access to data associated with your email address.</li>
          <li>Correct inaccurate information.</li>
          <li>Delete your account or remove your personal data.</li>
          <li>Unsubscribe from non-essential emails.</li>
        </ul>
        <p>
          To make a privacy request, email{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    title: "Security",
    body: (
      <>
        <p>
          We use reasonable technical and organizational measures to protect
          personal data. No internet service is completely secure, so we cannot
          guarantee absolute security.
        </p>
      </>
    ),
  },
  {
    title: "Children's Privacy",
    body: (
      <>
        <p>
          The service is not directed to children under 13. We do not knowingly
          collect personal data from children under 13. If you believe a child has
          provided personal data, contact us and we will take appropriate steps to
          remove it.
        </p>
      </>
    ),
  },
  {
    title: "Changes to This Policy",
    shortTitle: "Changes",
    body: (
      <>
        <p>
          We may update this Privacy Policy as the service changes. The updated
          version takes effect when posted on this page.
        </p>
      </>
    ),
  },
  {
    title: "Contact",
    body: (
      <>
        <p>
          Privacy questions and data requests can be sent to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      patternId="privacy-grid"
      title="Privacy Policy"
      updated={UPDATED}
      intro={
        <p>
          We collect emails, recipe activity, and usage data to run the waitlist,
          improve the service, support recipe-to-cart functionality, and understand
          how people use ate o&apos;clock.
        </p>
      }
      sections={sections}
    />
  );
}
