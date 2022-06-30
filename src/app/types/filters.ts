export interface Filters {
  productName?: string;
  price_gte?: number;
  price_lte?: number;
  isAvailable?: boolean | undefined;
}
