"use client";

import { Briefcase } from "lucide-react";
import { Salesperson } from "@/lib/types";

export function SalespersonForm({
  salesperson,
  onChange,
}: {
  salesperson: Salesperson;
  onChange: (s: Salesperson) => void;
}) {
  function set<K extends keyof Salesperson>(key: K, value: Salesperson[K]) {
    onChange({ ...salesperson, [key]: value });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
        <Briefcase size={16} />
        SALESPERSON
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Salesperson name"
          value={salesperson.name}
          onChange={(e) => set("name", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20"
        />
        <input
          type="email"
          placeholder="Email"
          value={salesperson.email}
          onChange={(e) => set("email", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={salesperson.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20"
        />
      </div>
    </div>
  );
}
