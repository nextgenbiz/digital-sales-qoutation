"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Sparkles } from "lucide-react";
import { CatalogData, CatalogEntry } from "@/lib/types";
import { formatCurrency } from "@/lib/calc";

export function CatalogPicker({
  catalog,
  quantities,
  onAdd,
}: {
  catalog: CatalogData;
  quantities: Record<string, number>;
  onAdd: (entry: CatalogEntry) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("packages");

  const allEntries = useMemo(
    () => [...catalog.packages, ...catalog.services].filter((e) => e.active),
    [catalog]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return allEntries.filter((e) => e.categoryId === activeCategory);
    }
    return allEntries.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  }, [allEntries, query, activeCategory]);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500">
        SERVICES & PACKAGES
      </div>

      <div className="relative mb-3">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search services..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-base focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20"
        />
      </div>

      {!query && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {catalog.categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? "bg-[#0B2050] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {filtered.map((entry) => (
          <EntryCard
            key={entry.id}
            entry={entry}
            qty={quantities[entry.id] ?? 0}
            onAdd={() => onAdd(entry)}
            accentColor={catalog.company.brandAccentColor}
          />
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full py-6 text-center text-sm text-slate-400">
            No matches. Try a different search.
          </p>
        )}
      </div>
    </div>
  );
}

function EntryCard({
  entry,
  qty,
  onAdd,
  accentColor,
}: {
  entry: CatalogEntry;
  qty: number;
  onAdd: () => void;
  accentColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className={`relative flex flex-col rounded-xl border p-3.5 text-left transition-all ${
        entry.isPackage
          ? "border-[#0B2050]/20 bg-gradient-to-br from-[#0B2050]/[0.04] to-transparent"
          : "border-slate-200 hover:border-slate-300"
      } hover:shadow-md`}
    >
      {entry.isPackage && (
        <span
          className="mb-1.5 inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-white"
          style={{ backgroundColor: accentColor }}
        >
          <Sparkles size={11} /> Package
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm font-semibold leading-tight text-slate-800">
          {entry.name}
        </span>
        {qty > 0 && (
          <span className="shrink-0 rounded-full bg-[#0B2050] px-2 py-0.5 text-xs font-bold text-white">
            {qty} in quote
          </span>
        )}
      </div>
      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
        {entry.description}
      </p>
      {entry.isPackage && entry.includes && (
        <ul className="mt-2 space-y-0.5">
          {entry.includes.slice(0, 3).map((inc) => (
            <li key={inc} className="text-[11px] text-slate-500">
              • {inc}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2.5 flex items-center justify-between">
        <span className="text-base font-bold text-slate-900">
          {entry.isCustomQuote ? "Custom Quote" : formatCurrency(entry.basePrice)}
          {!entry.isCustomQuote && (
            <span className="ml-1 text-xs font-normal text-slate-400">
              {entry.unit}
            </span>
          )}
        </span>
        <span className="flex items-center gap-1 rounded-lg bg-slate-900 px-2.5 py-1.5 text-xs font-semibold text-white">
          <Plus size={13} /> Add
        </span>
      </div>
    </button>
  );
}
