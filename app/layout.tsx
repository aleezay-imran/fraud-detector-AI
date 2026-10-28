import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DhokaCheck AI — Scam & Phishing Detector",
  description:
    "AI-powered tool to identify warning signs in suspicious messages, job offers, scholarship scams, and phishing attempts. Supports English and Roman Urdu.",
  keywords: ["scam detector", "phishing", "fraud", "AI", "cybersecurity", "Pakistan"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
