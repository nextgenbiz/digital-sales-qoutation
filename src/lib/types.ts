export type Category = {
  id: string;
  name: string;
};

export type CatalogEntry = {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  unit: string;
  taxPct: number;
  active: boolean;
  isPackage?: boolean;
  isCustomQuote?: boolean;
  includes?: string[];
};

export type Company = {
  name: string;
  tagline: string;
  logo: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  gstin: string;
  brandPrimaryColor: string;
  brandAccentColor: string;
  quoteNumberPrefix: string;
  defaultValidityDays: number;
  defaultTerms: string[];
};

export type CatalogData = {
  company: Company;
  categories: Category[];
  services: CatalogEntry[];
  packages: CatalogEntry[];
};

export type Customer = {
  name: string;
  phone: string;
  email: string;
  companyName: string;
  address: string;
  clientName: string;
};

export type Salesperson = {
  name: string;
  email: string;
  phone: string;
};

export type QuoteItem = {
  lineId: string;
  refId: string;
  name: string;
  description: string;
  unit: string;
  unitPrice: number;
  quantity: number;
  discountPct: number;
  taxPct: number;
  isCustomQuote?: boolean;
};

export type QuoteDiscount = {
  type: "percent" | "flat";
  value: number;
};

export type QuoteMeta = {
  quoteNumber: string;
  issueDate: string;
  expiryDate: string;
};

export type FullQuote = {
  company: Company;
  customer: Customer;
  salesperson: Salesperson;
  items: QuoteItem[];
  quoteDiscount: QuoteDiscount;
  meta: QuoteMeta;
  notes: string;
};
