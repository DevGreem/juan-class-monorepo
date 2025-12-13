export type Category = {
  id: number;
  name: string;
};

export type ProductBase = {
  id: number;
  name: string;
  description?: string | null;
  categories?: Category[];
  stock?: number;
};

export type SalableProduct = {
  id: number;
  price: string | number;
  product: ProductBase;
};
