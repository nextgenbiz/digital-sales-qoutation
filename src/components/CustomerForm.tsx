"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { Customer } from "@/lib/types";

export function CustomerForm({
  customer,
  onChange,
}: {
  customer: Customer;
  onChange: (c: Customer) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  function set<K extends keyof Customer>(key: K, value: Customer[K]) {
    onChange({ ...customer, [key]: value });
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
        <User size={16} />
        CUSTOMER
      </div>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Client name (optional)"
          value={customer.clientName}
          onChange={(e) => set("clientName", e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20"
        />
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="text"
          placeholder="Customer name *"
          value={customer.name}
          onChange={(e) => set("name", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20"
        />
        <input
          type="tel"
          placeholder="Phone number *"
          value={customer.phone}
          onChange={(e) => set("phone", e.target.value)}
          className="rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20"
        />
      </div>

      {expanded && (
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <input
            type="email"
            placeholder="Email (optional)"
            value={customer.email}
            onChange={(e) => set("email", e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20"
          />
          <input
            type="text"
            placeholder="Company name (optional)"
            value={customer.companyName}
            onChange={(e) => set("companyName", e.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20"
          />
          <textarea
            placeholder="Address (optional)"
            value={customer.address}
            onChange={(e) => set("address", e.target.value)}
            rows={2}
            className="rounded-lg border border-slate-300 px-3 py-2.5 text-base focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20 sm:col-span-2"
          />
        </div>
      )}

      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="mt-2 flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-700"
      >
        {expanded ? (
          <>
            Hide extra details <ChevronUp size={14} />
          </>
        ) : (
          <>
            + Add email / company / address <ChevronDown size={14} />
          </>
        )}
      </button>
    </div>
  );
}
