export function generateQuoteNumber(prefix: string): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${y}${m}${day}-${rand}`;
}

export function generateLineId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
