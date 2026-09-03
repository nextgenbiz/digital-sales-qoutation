"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { Download, Share2, ArrowLeft, RotateCcw, Loader2 } from "lucide-react";
import { FullQuote } from "@/lib/types";
import { QuoteDocument } from "@/components/pdf/QuoteDocument";
import { useLogoAvailable } from "@/lib/useLogoAvailable";

export function PreviewActions({
  quote,
  onEdit,
  onNewQuote,
}: {
  quote: FullQuote;
  onEdit: () => void;
  onNewQuote: () => void;
}) {
  const [busy, setBusy] = useState<"download" | "share" | null>(null);
  const [shareUnsupported, setShareUnsupported] = useState(false);
  const logoOk = useLogoAvailable(quote.company.logo);

  const fileName = `${quote.meta.quoteNumber}-${quote.customer.name || "quote"}.pdf`
    .replace(/\s+/g, "-")
    .toLowerCase();

  async function buildFile(): Promise<File> {
    const blob = await pdf(
      <QuoteDocument quote={quote} logoOk={logoOk} />
    ).toBlob();
    return new File([blob], fileName, { type: "application/pdf" });
  }

  async function handleDownload() {
    setBusy("download");
    try {
      const file = await buildFile();
      const url = URL.createObjectURL(file);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy(null);
    }
  }

  async function handleShare() {
    setBusy("share");
    setShareUnsupported(false);
    try {
      const file = await buildFile();
      const nav = navigator as Navigator & {
        canShare?: (data: { files: File[] }) => boolean;
        share?: (data: {
          files: File[];
          title?: string;
          text?: string;
        }) => Promise<void>;
      };
      if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
        await nav.share({
          files: [file],
          title: `Quotation ${quote.meta.quoteNumber}`,
          text: `Quotation from ${quote.company.name} for ${quote.customer.name}`,
        });
      } else {
        setShareUnsupported(true);
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") setShareUnsupported(true);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-2">
      <div className="flex flex-wrap items-center justify-between gap-3 py-4">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <ArrowLeft size={16} /> Edit quote
        </button>
        <button
          type="button"
          onClick={onNewQuote}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-700"
        >
          <RotateCcw size={16} /> Start new quote
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDownload}
          disabled={busy !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0B2050] px-5 py-3.5 text-base font-bold text-white shadow-md transition-transform enabled:hover:scale-[1.01] disabled:opacity-60"
        >
          {busy === "download" ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Download size={18} />
          )}
          Download PDF
        </button>
        <button
          type="button"
          onClick={handleShare}
          disabled={busy !== null}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-[#0B2050] px-5 py-3.5 text-base font-bold text-[#0B2050] transition-transform enabled:hover:scale-[1.01] disabled:opacity-60"
        >
          {busy === "share" ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Share2 size={18} />
          )}
          Share (WhatsApp / Email)
        </button>
      </div>

      {shareUnsupported && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-700">
          Direct sharing isn&apos;t supported in this browser. Please use{" "}
          <span className="font-semibold">Download PDF</span> and attach the
          file manually in WhatsApp or your email app.
        </p>
      )}
    </div>
  );
}
