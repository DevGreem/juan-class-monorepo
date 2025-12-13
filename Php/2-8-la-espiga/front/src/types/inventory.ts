import type { Category, SalableProduct } from "./products";

export type InventoryProduct = {
  id: number;
  name: string;
  sku: string;
  stock: number;
  cost: number | string | null;
  is_active: boolean;
  categories?: Category[];
  salable?: Pick<SalableProduct, "price"> | null;
};
