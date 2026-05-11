"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-4 py-2 text-sm font-bold text-white shadow-md shadow-sky-500/20 transition hover:shadow-sky-500/30"
    >
      <Printer className="h-4 w-4" />
      Yazdır
    </button>
  );
}
