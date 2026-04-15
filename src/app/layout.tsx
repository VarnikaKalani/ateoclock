import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ateoclock - From Recipe to Reality",
  description:
    "ateoclock connects food creators with home cooks. Share a recipe, your audience cooks it tonight with one tap.",
  openGraph: {
    title: "ateoclock - From Recipe to Reality",
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
    <html lang="en" data-scroll-behavior="smooth" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
