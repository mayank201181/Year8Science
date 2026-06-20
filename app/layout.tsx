import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ProgressProvider } from "@/lib/store";
import { SiteHeader } from "@/components/SiteHeader";
import { Mascot } from "@/components/Mascot";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Year 8 Science Lab",
  description:
    "An interactive Year 8 science course: illustrated guides, memory tricks, quizzes and practice papers across Biology, Chemistry and Physics.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <ProgressProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <Mascot />
          <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
            Year 8 Science Lab · Built for curious minds 🔬 · Your progress is saved on this device.
          </footer>
        </ProgressProvider>
      </body>
    </html>
  );
}
