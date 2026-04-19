import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/legal/legal-page";

const UPDATED = "April 17, 2026";
const CONTACT_EMAIL = "ateoclock.app@gmail.com";

export const metadata: Metadata = {
  title: "Disclaimer | ateoclock",
  description:
    "Disclaimer for ateoclock recipe content, ingredient matching, nutrition, allergies, grocery availability, pricing, and third-party checkout.",
};

const sections: LegalSection[] = [
  {
    title: "Recipe Content",
    body: (
      <>
        <p>
          Recipes on ate o&apos;clock may be user-generated, creator-provided,
          imported from links, or processed automatically. We do not guarantee that
          any recipe is complete, accurate, original, safe, or suitable for a
          specific person.
        </p>
      </>
    ),
  },
  {
    title: "Allergies and Dietary Restrictions",
    shortTitle: "Allergies",
    body: (
      <>
        <p>
          Allergies, dietary restrictions, medical needs, religious food rules,
          nutrition goals, and ingredient suitability are your responsibility. You
          should review recipes, labels, ingredients, substitutes, and product
          packaging before buying, cooking, or eating anything.
        </p>
      </>
    ),
  },
  {
    title: "Nutrition and Health Information",
    shortTitle: "Nutrition",
    body: (
      <>
        <p>
          Nutritional information, serving estimates, ingredient quantities, and
          dietary tags may be incomplete or inaccurate. ate o&apos;clock does not
          provide medical, nutrition, or dietary advice.
        </p>
      </>
    ),
  },
  {
    title: "Ingredient Matching",
    body: (
      <>
        <p>
          Ingredient matching and cart building may not always choose the exact
          product a recipe requires. Review all cart items, sizes, brands,
          substitutions, quantities, and package labels before checkout.
        </p>
      </>
    ),
  },
  {
    title: "Grocery Availability and Pricing",
    shortTitle: "Pricing",
    body: (
      <>
        <p>
          Grocery availability, prices, taxes, fees, discounts, and delivery
          estimates can change at any time. The final information shown by the
          grocery platform at checkout controls your order.
        </p>
      </>
    ),
  },
  {
    title: "Third-Party Checkout",
    shortTitle: "Checkout",
    body: (
      <>
        <p>
          Orders, payments, cancellations, refunds, delivery, substitutions, and
          customer support are handled by the third-party grocery or commerce
          platform you choose. ate o&apos;clock is not responsible for those
          third-party services.
        </p>
      </>
    ),
  },
  {
    title: "Questions",
    body: (
      <>
        <p>
          Questions about this disclaimer can be sent to{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </>
    ),
  },
];

export default function DisclaimerPage() {
  return (
    <LegalPage
      patternId="disclaimer-grid"
      title="Disclaimer"
      updated={UPDATED}
      intro={
        <p>
          This disclaimer explains the limits of recipe, ingredient, nutrition,
          cart, grocery, pricing, and third-party checkout information on ate
          o&apos;clock.
        </p>
      }
      sections={sections}
    />
  );
}
