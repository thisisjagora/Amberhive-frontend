export const formatCurrency = (amount) => {
  return amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD", // Change to "NGN" or "EUR" if needed
    minimumFractionDigits: 2,
  });
};

export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const getCurrencySymbol = (currency) => {
  if (!currency) return "";
  return currency.toUpperCase() === "NGN" ? "₦" : "$";
};
