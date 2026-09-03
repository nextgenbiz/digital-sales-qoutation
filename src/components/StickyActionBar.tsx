"use client";

import { formatCurrency } from "@/lib/calc";
import { ArrowRight } from "lucide-react";

export function StickyActionBar({
  grandTotal,
  itemCount,
  disabled,
  disabledReason,
  onGenerate,
}: {
  grandTotal: number;
  itemCount: number;
  disabled: boolean;
  disabledReason?: string;
  onGenerate: () => void;
}) {
  return (
    <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <div>
          <p className="text-xs text-slate-400">
            {itemCount} item{itemCount === 1 ? "" : "s"}
          </p>
          <p className="text-xl font-extrabold text-[#0B2050]">
            {formatCurrency(grandTotal)}
          </p>
        </div>
        <div className="text-right">
          <button
            type="button"
            disabled={disabled}
            onClick={onGenerate}
            className="flex items-center gap-2 rounded-xl bg-[#0B2050] px-5 py-3 text-base font-bold text-white shadow-md transition-transform enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Generate Quotation
            <ArrowRight size={18} />
          </button>
          {disabled && disabledReason && (
            <p className="mt-1 text-xs text-slate-400">{disabledReason}</p>
          )}
        </div>
      </div>
    </div>
  );
}
