import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SyllabAI",
  description: "AI-powered syllabus intelligence",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased flex h-screen overflow-hidden bg-[#f4f5f7]">
        {/* Sidebar */}
        <aside className="w-56 shrink-0 bg-[#1a1f2e] flex flex-col h-full">
          <div className="px-5 py-5 border-b border-white/10">
            <span className="text-white font-bold text-lg tracking-tight">SyllabAI</span>
            <span className="ml-1 text-indigo-400 text-xs font-semibold">beta</span>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1">
            <p className="px-2 text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-2">Main</p>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-600/20 text-indigo-300 text-sm font-medium">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Dashboard
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Syllabi
            </a>
            <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </a>
          </nav>

          <div className="px-5 py-4 border-t border-white/10">
            <p className="text-[11px] text-gray-600">Phase 5 — Groq AI</p>
          </div>
        </aside>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
