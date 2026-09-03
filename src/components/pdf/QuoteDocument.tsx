import {
  Document,
  Page,
  View,
  Text,
  Image,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";
import { FullQuote } from "@/lib/types";
import { computeTotals, formatCurrency } from "@/lib/calc";

Font.register({
  family: "Noto Sans",
  fonts: [
    { src: "/fonts/NotoSans-Regular.ttf", fontWeight: "normal" },
    { src: "/fonts/NotoSans-Bold.ttf", fontWeight: "bold" },
  ],
});

function styles(primary: string, accent: string) {
  return StyleSheet.create({
    page: {
      fontSize: 10,
      fontFamily: "Noto Sans",
      color: "#1e293b",
      paddingBottom: 40,
    },
    header: {
      backgroundColor: primary,
      paddingHorizontal: 32,
      paddingVertical: 24,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
    logo: { width: 40, height: 40, objectFit: "contain" },
    companyName: { fontSize: 15, fontFamily: "Noto Sans", fontWeight: "bold", color: "#fff" },
    tagline: { fontSize: 8, color: "#ffffffb3", marginTop: 2 },
    badge: {
      backgroundColor: accent,
      color: "#fff",
      fontSize: 10,
      fontFamily: "Noto Sans", fontWeight: "bold",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 4,
    },
    body: { paddingHorizontal: 32, paddingTop: 20 },
    metaRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 18 },
    label: {
      fontSize: 8,
      fontFamily: "Noto Sans", fontWeight: "bold",
      color: "#94a3b8",
      textTransform: "uppercase",
      marginBottom: 3,
    },
    customerName: { fontSize: 11, fontFamily: "Noto Sans", fontWeight: "bold", marginBottom: 1 },
    metaLine: { fontSize: 9, color: "#334155", marginBottom: 1 },
    metaValRow: { flexDirection: "row", justifyContent: "flex-end", gap: 6, marginBottom: 2 },
    metaKey: { fontSize: 9, color: "#94a3b8" },
    metaVal: { fontSize: 9, fontFamily: "Noto Sans", fontWeight: "bold", color: "#1e293b" },
    table: { marginBottom: 14 },
    tHeadRow: {
      flexDirection: "row",
      backgroundColor: primary,
      borderRadius: 3,
      paddingVertical: 6,
      paddingHorizontal: 8,
    },
    tHeadCell: {
      fontSize: 8,
      fontFamily: "Noto Sans", fontWeight: "bold",
      color: "#fff",
      textTransform: "uppercase",
    },
    tRow: {
      flexDirection: "row",
      paddingVertical: 7,
      paddingHorizontal: 8,
      borderBottomWidth: 0.5,
      borderBottomColor: "#e2e8f0",
    },
    tRowAlt: { backgroundColor: "#f8fafc" },
    cellName: { fontSize: 9.5, fontFamily: "Noto Sans", fontWeight: "bold", color: "#1e293b" },
    cellDesc: { fontSize: 7.5, color: "#94a3b8", marginTop: 1.5 },
    cellText: { fontSize: 9, color: "#334155" },
    cellTotal: { fontSize: 9.5, fontFamily: "Noto Sans", fontWeight: "bold", color: "#1e293b" },
    colName: { width: "42%" },
    colQty: { width: "10%", textAlign: "center" },
    colPrice: { width: "16%", textAlign: "right" },
    colDisc: { width: "12%", textAlign: "right" },
    colTotal: { width: "20%", textAlign: "right" },
    totalsBox: { alignSelf: "flex-end", width: 220, marginBottom: 20 },
    totalsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
    totalsLabel: { fontSize: 9, color: "#64748b" },
    totalsVal: { fontSize: 9, fontFamily: "Noto Sans", fontWeight: "bold", color: "#334155" },
    grandRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: primary,
      borderRadius: 4,
      paddingVertical: 8,
      paddingHorizontal: 10,
      marginTop: 4,
    },
    grandLabel: { fontSize: 10, fontFamily: "Noto Sans", fontWeight: "bold", color: "#fff" },
    grandVal: { fontSize: 13, fontFamily: "Noto Sans", fontWeight: "bold", color: "#fff" },
    section: { marginBottom: 16 },
    sectionText: { fontSize: 9, color: "#475569", lineHeight: 1.4 },
    termItem: { fontSize: 8, color: "#64748b", marginBottom: 2, lineHeight: 1.3 },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-end",
      borderTopWidth: 0.5,
      borderTopColor: "#e2e8f0",
      paddingTop: 14,
      marginTop: 10,
    },
    footerText: { fontSize: 8, color: "#94a3b8" },
    sigLine: {
      width: 140,
      borderBottomWidth: 0.5,
      borderBottomColor: "#cbd5e1",
      marginBottom: 4,
      height: 30,
    },
    sigLabel: { fontSize: 8, color: "#94a3b8", textAlign: "center" },
  });
}

export function QuoteDocument({
  quote,
  logoOk,
}: {
  quote: FullQuote;
  logoOk: boolean;
}) {
  const { company, customer, salesperson, items, meta, notes, quoteDiscount } =
    quote;
  const totals = computeTotals(items, quoteDiscount);
  const byId = new Map(totals.items.map((b) => [b.lineId, b]));
  const s = styles(company.brandPrimaryColor, company.brandAccentColor);

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <View style={s.headerLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, not an <img> */}
            {logoOk && <Image src={company.logo} style={s.logo} />}
            <View>
              
            </View>
          </View>
          <Text style={s.badge}>QUOTATION</Text>
        </View>

        <View style={s.body}>
          <View style={s.metaRow}>
            <View>
              <Text style={s.label}>Quotation For</Text>
              {customer.clientName ? (
                <Text style={s.customerName}>{customer.clientName}</Text>
              ) : null}
              <Text
                style={
                  customer.clientName ? s.metaLine : s.customerName
                }
              >
                {customer.name || "-"}
              </Text>
              {customer.companyName ? (
                <Text style={s.metaLine}>{customer.companyName}</Text>
              ) : null}
              {customer.phone ? (
                <Text style={s.metaLine}>{customer.phone}</Text>
              ) : null}
              {customer.email ? (
                <Text style={s.metaLine}>{customer.email}</Text>
              ) : null}
              {customer.address ? (
                <Text style={s.metaLine}>{customer.address}</Text>
              ) : null}
            </View>
            <View>
              <View style={s.metaValRow}>
                <Text style={s.metaKey}>Quote #</Text>
                <Text style={s.metaVal}>{meta.quoteNumber}</Text>
              </View>
              <View style={s.metaValRow}>
                <Text style={s.metaKey}>Date</Text>
                <Text style={s.metaVal}>{meta.issueDate}</Text>
              </View>
              <View style={s.metaValRow}>
                <Text style={s.metaKey}>Valid Until</Text>
                <Text style={s.metaVal}>{meta.expiryDate}</Text>
              </View>
              {company.gstin ? (
                <View style={s.metaValRow}>
                  <Text style={s.metaKey}>GSTIN</Text>
                  <Text style={s.metaVal}>{company.gstin}</Text>
                </View>
              ) : null}
              {salesperson.name ? (
                <>
                  <Text style={[s.label, { marginTop: 10, textAlign: "right" }]}>
                    Prepared By
                  </Text>
                  <Text style={[s.customerName, { textAlign: "right" }]}>
                    {salesperson.name}
                  </Text>
                  {salesperson.phone ? (
                    <Text style={[s.metaLine, { textAlign: "right" }]}>
                      {salesperson.phone}
                    </Text>
                  ) : null}
                  {salesperson.email ? (
                    <Text style={[s.metaLine, { textAlign: "right" }]}>
                      {salesperson.email}
                    </Text>
                  ) : null}
                </>
              ) : null}
            </View>
          </View>

          <View style={s.table}>
            <View style={s.tHeadRow}>
              <Text style={[s.tHeadCell, s.colName]}>Service</Text>
              <Text style={[s.tHeadCell, s.colQty]}>Qty</Text>
              <Text style={[s.tHeadCell, s.colPrice]}>Price</Text>
              <Text style={[s.tHeadCell, s.colDisc]}>Disc.</Text>
              <Text style={[s.tHeadCell, s.colTotal]}>Total</Text>
            </View>
            {items.map((item, i) => {
              const line = byId.get(item.lineId);
              return (
                <View
                  key={item.lineId}
                  style={[s.tRow, ...(i % 2 === 1 ? [s.tRowAlt] : [])]}
                >
                  <View style={s.colName}>
                    <Text style={s.cellName}>{item.name}</Text>
                    <Text style={s.cellDesc}>{item.description}</Text>
                  </View>
                  <Text style={[s.cellText, s.colQty]}>{item.quantity}</Text>
                  <Text style={[s.cellText, s.colPrice]}>
                    {formatCurrency(item.unitPrice)}
                  </Text>
                  <Text style={[s.cellText, s.colDisc]}>
                    {item.discountPct > 0 ? `${item.discountPct}%` : "-"}
                  </Text>
                  <Text style={[s.cellTotal, s.colTotal]}>
                    {formatCurrency(line?.total ?? 0)}
                  </Text>
                </View>
              );
            })}
          </View>

          <View style={s.totalsBox}>
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>Subtotal</Text>
              <Text style={s.totalsVal}>{formatCurrency(totals.subtotal)}</Text>
            </View>
            {totals.lineDiscountTotal > 0 && (
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>Line discounts</Text>
                <Text style={s.totalsVal}>
                  - {formatCurrency(totals.lineDiscountTotal)}
                </Text>
              </View>
            )}
            {totals.quoteDiscountAmt > 0 && (
              <View style={s.totalsRow}>
                <Text style={s.totalsLabel}>Quote discount</Text>
                <Text style={s.totalsVal}>
                  - {formatCurrency(totals.quoteDiscountAmt)}
                </Text>
              </View>
            )}
            <View style={s.totalsRow}>
              <Text style={s.totalsLabel}>Tax (GST)</Text>
              <Text style={s.totalsVal}>{formatCurrency(totals.taxTotal)}</Text>
            </View>
            <View style={s.grandRow}>
              <Text style={s.grandLabel}>Grand Total</Text>
              <Text style={s.grandVal}>{formatCurrency(totals.grandTotal)}</Text>
            </View>
          </View>

          {notes ? (
            <View style={s.section}>
              <Text style={s.label}>Notes</Text>
              <Text style={s.sectionText}>{notes}</Text>
            </View>
          ) : null}

          {company.defaultTerms.length > 0 && (
            <View style={s.section}>
              <Text style={s.label}>Terms & Conditions</Text>
              {company.defaultTerms.map((t, i) => (
                <Text key={t} style={s.termItem}>
                  {i + 1}. {t}
                </Text>
              ))}
            </View>
          )}

          <View style={s.footer}>
            <View>
              <Text style={s.footerText}>
                {company.phone} - {company.email}
              </Text>
              {company.website ? (
                <Text style={s.footerText}>{company.website}</Text>
              ) : null}
            </View>
            <View>
              <View style={s.sigLine} />
              <Text style={s.sigLabel}>Authorized Signature</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
