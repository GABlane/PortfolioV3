import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { GlassNavbar } from "@/components/layout/GlassNavbar";
import { Footer } from "@/components/layout/Footer";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { PointerLight } from "@/components/motion/PointerLight";
import { CommandMenu } from "@/components/layout/CommandMenu";
import { MobileTabBar } from "@/components/layout/MobileTabBar";
import { getCommandItems } from "@/lib/command-items";
import { ChatAssistant } from "@/components/chat/ChatAssistant";
import { isChatEnabled } from "@/lib/chat/config";
import { profile } from "@/data/profile";
import { hasCanonicalDomain, siteDescription, siteTitle, siteUrl } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: `%s · ${profile.preferredName} Ofiangga`,
  },
  description: siteDescription,
  applicationName: `${profile.name} — Portfolio`,
  authors: [{ name: profile.name, url: profile.social.github }],
  creator: profile.name,
  keywords: [
    "John Gabrielle Ofiangga",
    "Gab Ofiangga",
    "full-stack developer",
    "software developer Philippines",
    "React",
    "Next.js",
    "TypeScript",
    "FastAPI",
    "portfolio",
  ],
  alternates: hasCanonicalDomain ? { canonical: "/" } : undefined,
  openGraph: {
    type: "website",
    locale: "en_PH",
    url: "/",
    siteName: `${profile.name}`,
    title: siteTitle,
    description: siteDescription,
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#F8FAFF",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="flex min-h-svh flex-col">
        <a
          href="#main"
          className="glass glass-strong fixed top-3 left-3 z-[60] -translate-y-24 rounded-full px-4 py-2.5 text-sm font-medium text-ink transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <AmbientBackground />
        <PointerLight />
        <MotionProvider>
          <GlassNavbar />
          <main id="main" className="flex-1 overflow-x-clip">
            {children}
          </main>
          <Footer />
          <MobileTabBar chatEnabled={isChatEnabled()} />
          <CommandMenu items={getCommandItems({ chat: isChatEnabled() })} />
          {isChatEnabled() && <ChatAssistant />}
        </MotionProvider>
      </body>
    </html>
  );
}
