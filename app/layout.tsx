import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RoadSOS — 24x7 Emergency Roadside Assistance in India",
  description:
    "Stuck on the road? RoadSOS provides instant 24x7 roadside assistance for battery jumpstart, fuel delivery, flat tyre, towing, and more. GPS-enabled, verified partners, 15-min response time.",
  keywords: [
    "roadside assistance India",
    "battery jumpstart",
    "fuel delivery",
    "tow truck",
    "flat tyre repair",
    "24x7 emergency car help",
    "RoadSOS",
  ],
  openGraph: {
    title: "RoadSOS — 24x7 Emergency Roadside Assistance",
    description:
      "Instant roadside assistance anywhere in India. Battery, fuel, tyre, towing and more.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="antialiased" style={{ fontFamily: "var(--font-inter), 'Inter', sans-serif" }}>
        {children}
        <Script
          src="https://cdn.jotfor.ms/agent/embedjs/019e5b15e1607bdf82019cd4a375c3ad8887/embed.js?autoOpenChatIn=1"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
