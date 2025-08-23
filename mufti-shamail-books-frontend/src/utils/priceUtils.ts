// Utility functions for handling price formatting

export type PriceType = number | string | { $numberDecimal: string } | null | undefined;

export const formatPrice = (price: PriceType): number => {
  // Handle MongoDB Decimal128 format: { "$numberDecimal": "150" }
  if (price && typeof price === 'object' && '$numberDecimal' in price) {
    return parseFloat(price.$numberDecimal);
  }
  
  // Handle regular number or string
  if (typeof price === 'string') {
    return parseFloat(price);
  }
  
  // Handle regular number
  if (typeof price === 'number') {
    return price;
  }
  
  // Default fallback
  return 0;
};

export const formatCurrency = (price: PriceType, currency: string = '₹'): string => {
  const numericPrice = formatPrice(price);
  return `${currency}${numericPrice.toFixed(2)}`;
};

export const formatCurrencyInt = (price: PriceType, currency: string = '₹'): string => {
  const numericPrice = formatPrice(price);
  return `${currency}${Math.round(numericPrice)}`;
};
