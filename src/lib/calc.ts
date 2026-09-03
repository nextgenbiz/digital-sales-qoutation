import { QuoteDiscount, QuoteItem } from "./types";

export type ItemBreakdown = {
  lineId: string;
  base: number;
  lineDiscountAmt: number;
  afterLineDiscount: number;
  quoteDiscountShare: number;
  taxableAmt: number;
  taxAmt: number;
  total: number;
};

export type QuoteTotals = {
  items: ItemBreakdown[];
  subtotal: number;
  lineDiscountTotal: number;
  quoteDiscountAmt: number;
  taxTotal: number;
  grandTotal: number;
};

export function computeTotals(
  items: QuoteItem[],
  quoteDiscount: QuoteDiscount
): QuoteTotals {
  const raw = items.map((item) => {
    const base = item.quantity * item.unitPrice;
    const lineDiscountAmt = base * (item.discountPct / 100);
    const afterLineDiscount = base - lineDiscountAmt;
    return { item, base, lineDiscountAmt, afterLineDiscount };
  });

  const subtotal = raw.reduce((sum, r) => sum + r.base, 0);
  const lineDiscountTotal = raw.reduce((sum, r) => sum + r.lineDiscountAmt, 0);
  const afterLineDiscountTotal = subtotal - lineDiscountTotal;

  const quoteDiscountAmt =
    afterLineDiscountTotal <= 0
      ? 0
      : quoteDiscount.type === "percent"
        ? afterLineDiscountTotal * (quoteDiscount.value / 100)
        : Math.min(quoteDiscount.value, afterLineDiscountTotal);

  let taxTotal = 0;
  const breakdown: ItemBreakdown[] = raw.map((r) => {
    const share =
      afterLineDiscountTotal > 0
        ? r.afterLineDiscount / afterLineDiscountTotal
        : 0;
    const quoteDiscountShare = quoteDiscountAmt * share;
    const taxableAmt = r.afterLineDiscount - quoteDiscountShare;
    const taxAmt = taxableAmt * (r.item.taxPct / 100);
    taxTotal += taxAmt;
    return {
      lineId: r.item.lineId,
      base: r.base,
      lineDiscountAmt: r.lineDiscountAmt,
      afterLineDiscount: r.afterLineDiscount,
      quoteDiscountShare,
      taxableAmt,
      taxAmt,
      total: taxableAmt + taxAmt,
    };
  });

  const grandTotal = afterLineDiscountTotal - quoteDiscountAmt + taxTotal;

  return {
    items: breakdown,
    subtotal,
    lineDiscountTotal,
    quoteDiscountAmt,
    taxTotal,
    grandTotal,
  };
}

export function formatCurrency(n: number): string {
  const rounded = Math.round(n);
  return `₹${rounded.toLocaleString("en-IN")}`;
}

export function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
