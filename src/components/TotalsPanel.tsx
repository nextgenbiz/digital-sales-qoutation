"use client";

import { QuoteDiscount } from "@/lib/types";
import { QuoteTotals, formatCurrency } from "@/lib/calc";

const DISCOUNT_PRESETS = [0, 5, 10, 15];
const VALIDITY_PRESETS = [7, 15, 30];

export function TotalsPanel({
  totals,
  quoteDiscount,
  onQuoteDiscountChange,
  validityDays,
  onValidityDaysChange,
  notes,
  onNotesChange,
}: {
  totals: QuoteTotals;
  quoteDiscount: QuoteDiscount;
  onQuoteDiscountChange: (d: QuoteDiscount) => void;
  validityDays: number;
  onValidityDaysChange: (days: number) => void;
  notes: string;
  onNotesChange: (n: string) => void;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-slate-500">
        DISCOUNT
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {DISCOUNT_PRESETS.map((pct) => (
          <button
            key={pct}
            type="button"
            onClick={() => onQuoteDiscountChange({ type: "percent", value: pct })}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              quoteDiscount.type === "percent" && quoteDiscount.value === pct
                ? "bg-[#0B2050] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {pct === 0 ? "None" : `${pct}%`}
          </button>
        ))}
        <input
          type="number"
          placeholder="Custom %"
          value={
            quoteDiscount.type === "percent" &&
            !DISCOUNT_PRESETS.includes(quoteDiscount.value)
              ? quoteDiscount.value
              : ""
          }
          onChange={(e) =>
            onQuoteDiscountChange({
              type: "percent",
              value: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
            })
          }
          className="w-24 rounded-full border border-slate-300 px-3 py-1.5 text-sm focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20"
        />
      </div>

      <div className="mb-3 text-sm font-semibold text-slate-500">
        QUOTE VALIDITY
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {VALIDITY_PRESETS.map((days) => (
          <button
            key={days}
            type="button"
            onClick={() => onValidityDaysChange(days)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              validityDays === days
                ? "bg-[#0B2050] text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {days} days
          </button>
        ))}
      </div>

      <div className="mb-4">
        <div className="mb-2 text-sm font-semibold text-slate-500">
          NOTES (OPTIONAL)
        </div>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Anything specific to mention to the customer..."
          rows={2}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#0B2050] focus:outline-none focus:ring-2 focus:ring-[#0B2050]/20"
        />
      </div>

      <div className="space-y-1.5 border-t border-slate-100 pt-3 text-sm">
        <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
        {totals.lineDiscountTotal > 0 && (
          <Row
            label="Line discounts"
            value={`- ${formatCurrency(totals.lineDiscountTotal)}`}
            muted
          />
        )}
        {totals.quoteDiscountAmt > 0 && (
          <Row
            label="Quote discount"
            value={`- ${formatCurrency(totals.quoteDiscountAmt)}`}
            muted
          />
        )}
        <Row label="Tax (GST)" value={formatCurrency(totals.taxTotal)} />
        <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2">
          <span className="text-base font-bold text-slate-900">
            Grand Total
          </span>
          <span className="text-2xl font-extrabold text-[#0B2050]">
            {formatCurrency(totals.grandTotal)}
          </span>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
}: {
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={muted ? "text-red-500" : "font-medium text-slate-700"}>
        {value}
      </span>
    </div>
  );
}
