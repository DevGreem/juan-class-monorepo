import type { ProductBase } from "./products";

export type CartItem = {
  salable_product_id: number;
  quantity: number;
  taxes?: number;
};

export type CartPreviewItem = {
  salable_product_id: number;
  quantity: number;
  tax_rate: number;
  unit_price: number;
  subtotal: number;
  tax_amount: number;
  total: number;
  product: ProductBase;
};

export type CartPreviewResponse = {
  items: CartPreviewItem[];
  summary: {
    subtotal: number;
    taxes: number;
    total: number;
  };
};
