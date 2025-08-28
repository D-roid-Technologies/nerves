export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const parsePrice = (price: string): number => {
  return Number(price.replace(/[^0-9.-]+/g, ""));
};
