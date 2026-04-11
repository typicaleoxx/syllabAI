import type { Metadata } from "next";
import NavLinks from "./components/NavLinks";
import "./globals.css";

export const metadata: Metadata = {
  title: "SyllabAI",
  description: "AI-powered syllabus intelligence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased flex h-screen overflow-hidden bg-[#f4f5f7]">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 bg-[#1a1f2e] flex flex-col h-full">
          <div className="px-5 py-5 border-b border-white/10">
            <span className="text-white font-bold text-lg tracking-tight">
              SyllabAI
            </span>
            <span className="ml-1 text-indigo-400 text-xs font-semibold">
              beta
            </span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            <p className="px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">
              Main
            </p>
            <NavLinks />
          </nav>

          <div className="px-5 py-4 border-t border-white/10">
            <p className="text-[11px] text-gray-600">Phase 5 — Groq AI</p>
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto">{children}</div>
      </body>
    </html>
  );
}
