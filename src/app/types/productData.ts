import { Product } from './product';

export interface ProductData {
  products: Product[] | null;
  productCount: number;
}
