import type { Metadata } from "next";
import "./globals.css";
import { Epilogue, Manrope } from "next/font/google";

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  weight: ["400", "700", "800"],
  style: ["normal", "italic"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "Coookd — From Recipe to Reality",
  description:
    "Coookd connects food creators with home cooks. Share a recipe, your audience cooks it tonight with one tap.",
  openGraph: {
    title: "Coookd — From Recipe to Reality",
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
    <html lang="en" className={`${epilogue.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
