import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TruddleNav } from "@/components/truddle-nav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Truddle - Trading Dashboard",
  description: "Vol Regime, Derivatives, Trader's Cockpit, Premarket & Energy Trading Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen bg-gray-50">
          <TruddleNav />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}