import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { Mascot } from "@/components/Mascot";
import { AppGate } from "@/components/AppGate";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Year 8 Science Lab",
  description:
    "An interactive Year 8 science course: illustrated guides, memory tricks, quizzes and practice papers across Biology, Chemistry and Physics.",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Science Lab" },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        {/* Errors in this layout bypass app/error.tsx, so the provider gets its own boundary. */}
        <ErrorBoundary>
        <ProgressProvider>
          <AppGate>
            <ErrorBoundary silent><SiteHeader /></ErrorBoundary>
            <main className="flex-1">{children}</main>
            <ErrorBoundary silent><Mascot /></ErrorBoundary>
            <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
              Year 8 Science Lab · Built for curious minds 🔬 · Progress syncs across devices.
            </footer>
          </AppGate>
        </ProgressProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
