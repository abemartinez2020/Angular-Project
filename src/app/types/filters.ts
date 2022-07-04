export interface Filters {
  page: number;
  size: number;
  productName?: string;
  price_gte?: number;
  price_lte?: number;
  isAvailable?: boolean | undefined;
}
