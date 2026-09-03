"use client";

import { FullQuote } from "@/lib/types";
import { computeTotals, formatCurrency } from "@/lib/calc";
import { useLogoAvailable } from "@/lib/useLogoAvailable";

export function QuotePreview({ quote }: { quote: FullQuote }) {
  const { company, customer, salesperson, items, meta, notes, quoteDiscount } = quote;
  const totals = computeTotals(items, quoteDiscount);
  const logoOk = useLogoAvailable(company.logo);
  const byId = new Map(totals.items.map((b) => [b.lineId, b]));

  return (
    <div
      id="quote-preview-doc"
      className="mx-auto w-full max-w-3xl bg-white text-slate-800 shadow-lg"
    >
      {/* Header */}
      <div
        className="flex items-center justify-between gap-4 px-8 py-7"
        style={{ backgroundColor: company.brandPrimaryColor }}
      >
        <div className="flex items-center gap-3">
          {logoOk && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={company.logo} alt="" className="h-12 w-auto object-contain" />
          )}
         
        </div>
        <div
          className="rounded-lg px-3 py-1.5 text-sm font-bold text-white"
          style={{ backgroundColor: company.brandAccentColor }}
        >
          QUOTATION
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Meta + customer */}
        <div className="mb-6 grid grid-cols-2 gap-6 text-sm">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Quotation For
            </p>
            {customer.clientName && (
              <p className="font-semibold text-slate-900">{customer.clientName}</p>
            )}
            <p className={customer.clientName ? "text-slate-700" : "font-semibold text-slate-900"}>
              {customer.name || "—"}
            </p>
            {customer.companyName && <p>{customer.companyName}</p>}
            {customer.phone && <p>{customer.phone}</p>}
            {customer.email && <p>{customer.email}</p>}
            {customer.address && (
              <p className="whitespace-pre-line text-slate-500">
                {customer.address}
              </p>
            )}
          </div>
          <div className="text-right">
            <Row label="Quote #" value={meta.quoteNumber} />
            <Row label="Date" value={meta.issueDate} />
            <Row label="Valid Until" value={meta.expiryDate} />
            {company.gstin && <Row label="GSTIN" value={company.gstin} />}
            {salesperson.name && (
              <>
                <p className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Prepared By
                </p>
                <p className="font-semibold text-slate-900">{salesperson.name}</p>
                {salesperson.phone && <p>{salesperson.phone}</p>}
                {salesperson.email && <p>{salesperson.email}</p>}
              </>
            )}
          </div>
        </div>

        {/* Items table */}
        <table className="mb-4 w-full border-collapse text-sm">
          <thead>
            <tr style={{ backgroundColor: company.brandPrimaryColor }}>
              <th className="rounded-l-md px-3 py-2 text-left text-xs font-semibold uppercase text-white">
                Service
              </th>
              <th className="px-2 py-2 text-center text-xs font-semibold uppercase text-white">
                Qty
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold uppercase text-white">
                Price
              </th>
              <th className="px-2 py-2 text-right text-xs font-semibold uppercase text-white">
                Disc.
              </th>
              <th className="rounded-r-md px-3 py-2 text-right text-xs font-semibold uppercase text-white">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const line = byId.get(item.lineId);
              return (
                <tr
                  key={item.lineId}
                  className={i % 2 === 1 ? "bg-slate-50" : ""}
                >
                  <td className="px-3 py-2.5 align-top">
                    <p className="font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </td>
                  <td className="px-2 py-2.5 text-center align-top">
                    {item.quantity}
                  </td>
                  <td className="px-2 py-2.5 text-right align-top">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-2 py-2.5 text-right align-top text-slate-500">
                    {item.discountPct > 0 ? `${item.discountPct}%` : "—"}
                  </td>
                  <td className="px-3 py-2.5 text-right align-top font-semibold">
                    {formatCurrency(line?.total ?? 0)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals */}
        <div className="mb-6 flex justify-end">
          <div className="w-64 space-y-1.5 text-sm">
            <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
            {totals.lineDiscountTotal > 0 && (
              <Row
                label="Line discounts"
                value={`- ${formatCurrency(totals.lineDiscountTotal)}`}
              />
            )}
            {totals.quoteDiscountAmt > 0 && (
              <Row
                label="Quote discount"
                value={`- ${formatCurrency(totals.quoteDiscountAmt)}`}
              />
            )}
            <Row label="Tax (GST)" value={formatCurrency(totals.taxTotal)} />
            <div
              className="mt-2 flex items-center justify-between rounded-lg px-3 py-2 text-white"
              style={{ backgroundColor: company.brandPrimaryColor }}
            >
              <span className="text-sm font-bold">Grand Total</span>
              <span className="text-lg font-extrabold">
                {formatCurrency(totals.grandTotal)}
              </span>
            </div>
          </div>
        </div>

        {notes && (
          <div className="mb-5">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Notes
            </p>
            <p className="text-sm text-slate-600">{notes}</p>
          </div>
        )}

        {company.defaultTerms.length > 0 && (
          <div className="mb-8">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Terms & Conditions
            </p>
            <ol className="list-decimal space-y-0.5 pl-4 text-xs text-slate-500">
              {company.defaultTerms.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </div>
        )}

        {/* Signature */}
        <div className="flex items-end justify-between border-t border-slate-100 pt-6">
          <div>
            <p className="text-xs text-slate-400">
              {company.phone} · {company.email}
            </p>
            {company.website && (
              <p className="text-xs text-slate-400">{company.website}</p>
            )}
          </div>
          <div className="text-center">
            <div className="mb-1 h-10 w-40 border-b border-slate-300" />
            <p className="text-xs text-slate-400">Authorized Signature</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-700">{value}</span>
    </div>
  );
}
