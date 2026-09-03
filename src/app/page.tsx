"use client";

import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import catalogRaw from "@/data/catalog.json";
import {
  CatalogData,
  CatalogEntry,
  Customer,
  FullQuote,
  QuoteDiscount,
  QuoteItem,
  Salesperson,
} from "@/lib/types";
import { addDays, computeTotals, formatDate } from "@/lib/calc";
import { generateLineId, generateQuoteNumber } from "@/lib/quoteNumber";
import { CustomerForm } from "@/components/CustomerForm";
import { SalespersonForm } from "@/components/SalespersonForm";
import { CatalogPicker } from "@/components/CatalogPicker";
import { QuoteCart } from "@/components/QuoteCart";
import { TotalsPanel } from "@/components/TotalsPanel";
import { StickyActionBar } from "@/components/StickyActionBar";
import { QuotePreview } from "@/components/QuotePreview";
import { PreviewActions } from "@/components/PreviewActions";

const catalog = catalogRaw as CatalogData;

const emptyCustomer: Customer = {
  name: "",
  phone: "",
  email: "",
  companyName: "",
  address: "",
  clientName: "",
};

const emptySalesperson: Salesperson = {
  name: "",
  email: "",
  phone: "",
};

export default function Home() {
  const [view, setView] = useState<"build" | "preview">("build");
  const [customer, setCustomer] = useState<Customer>(emptyCustomer);
  const [salesperson, setSalesperson] = useState<Salesperson>(emptySalesperson);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [quoteDiscount, setQuoteDiscount] = useState<QuoteDiscount>({
    type: "percent",
    value: 0,
  });
  const [validityDays, setValidityDays] = useState(
    catalog.company.defaultValidityDays
  );
  const [notes, setNotes] = useState("");
  const [fullQuote, setFullQuote] = useState<FullQuote | null>(null);

  const totals = useMemo(
    () => computeTotals(items, quoteDiscount),
    [items, quoteDiscount]
  );

  const quantities = useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of items) {
      map[item.refId] = (map[item.refId] ?? 0) + item.quantity;
    }
    return map;
  }, [items]);

  function handleAdd(entry: CatalogEntry) {
    setItems((prev) => {
      const existing = prev.find((i) => i.refId === entry.id);
      if (existing) {
        return prev.map((i) =>
          i.lineId === existing.lineId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      const newItem: QuoteItem = {
        lineId: generateLineId(),
        refId: entry.id,
        name: entry.name,
        description: entry.description,
        unit: entry.unit,
        unitPrice: entry.basePrice,
        quantity: 1,
        discountPct: 0,
        taxPct: entry.taxPct,
        isCustomQuote: entry.isCustomQuote,
      };
      return [...prev, newItem];
    });
  }

  function handleUpdate(lineId: string, patch: Partial<QuoteItem>) {
    setItems((prev) =>
      prev.map((i) => (i.lineId === lineId ? { ...i, ...patch } : i))
    );
  }

  function handleRemove(lineId: string) {
    setItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }

  const hasUnpricedCustomItem = items.some(
    (i) => i.isCustomQuote && i.unitPrice === 0
  );
  const canGenerate =
    items.length > 0 &&
    customer.name.trim().length > 0 &&
    customer.phone.trim().length > 0 &&
    !hasUnpricedCustomItem;

  function disabledReason() {
    if (items.length === 0) return "Add at least one service to continue";
    if (!customer.name.trim() || !customer.phone.trim())
      return "Enter customer name & phone to continue";
    if (hasUnpricedCustomItem) return "Set a price for custom items";
    return undefined;
  }

  function handleGenerate() {
    const now = new Date();
    const quote: FullQuote = {
      company: catalog.company,
      customer,
      salesperson,
      items,
      quoteDiscount,
      notes,
      meta: {
        quoteNumber: generateQuoteNumber(catalog.company.quoteNumberPrefix),
        issueDate: formatDate(now),
        expiryDate: formatDate(addDays(now, validityDays)),
      },
    };
    setFullQuote(quote);
    setView("preview");
  }

  function handleNewQuote() {
    setCustomer(emptyCustomer);
    setSalesperson(emptySalesperson);
    setItems([]);
    setQuoteDiscount({ type: "percent", value: 0 });
    setValidityDays(catalog.company.defaultValidityDays);
    setNotes("");
    setFullQuote(null);
    setView("build");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-5xl items-center gap-2.5">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white"
            style={{ backgroundColor: catalog.company.brandPrimaryColor }}
          >
            <FileText size={18} />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight text-slate-900">
              {catalog.company.name}
            </p>
            <p className="text-xs leading-tight text-slate-400">
              Quick Quote
            </p>
          </div>
        </div>
      </header>

      {view === "build" ? (
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-5">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="space-y-5 lg:col-span-2">
              <CustomerForm customer={customer} onChange={setCustomer} />
              <SalespersonForm
                salesperson={salesperson}
                onChange={setSalesperson}
              />
              <CatalogPicker
                catalog={catalog}
                quantities={quantities}
                onAdd={handleAdd}
              />
              <QuoteCart
                items={items}
                breakdown={totals.items}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            </div>
            <div className="lg:col-span-1">
              <TotalsPanel
                totals={totals}
                quoteDiscount={quoteDiscount}
                onQuoteDiscountChange={setQuoteDiscount}
                validityDays={validityDays}
                onValidityDaysChange={setValidityDays}
                notes={notes}
                onNotesChange={setNotes}
              />
            </div>
          </div>
        </main>
      ) : (
        <main className="flex-1 bg-slate-100 py-6">
          {fullQuote && <QuotePreview quote={fullQuote} />}
          {fullQuote && (
            <PreviewActions
              quote={fullQuote}
              onEdit={() => setView("build")}
              onNewQuote={handleNewQuote}
            />
          )}
        </main>
      )}

      {view === "build" && (
        <StickyActionBar
          grandTotal={totals.grandTotal}
          itemCount={items.length}
          disabled={!canGenerate}
          disabledReason={disabledReason()}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  );
}
