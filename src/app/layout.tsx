import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cookd — From Recipe to Reality",
  description:
    "Cookd connects food creators with home cooks. Share a recipe, your audience cooks it tonight with one tap.",
  openGraph: {
    title: "Cookd — From Recipe to Reality",
    description:
      "One tap from your favourite creator's recipe to groceries at your door.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
