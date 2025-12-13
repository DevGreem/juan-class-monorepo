import type { ProductBase } from "./products";

export type SaleSummary = {
  id: number;
  code: string;
  status: string;
  paid_at?: string | null;
  subtotal: number;
  total: number;
  tax_total: number;
  line_count?: number;
  units_count?: number;
  user_id: number;
  user_name?: string | null;
  user_email?: string | null;
  user_phone?: string | null;
};

export type SaleItemDetail = {
  id: number;
  sale_id: number;
  salable_product_id: number;
  quantity: number;
  taxes?: number | null;
  unit_price: number;
  subtotal: number;
  total: number;
  tax_amount: number;
  product: ProductBase;
};

export type SaleResponse = {
  sale: SaleSummary & {
    created_at?: string;
    updated_at?: string;
  };
  items: SaleItemDetail[];
};
