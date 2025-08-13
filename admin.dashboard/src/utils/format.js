export const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export const formatNaira = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return "₦0.00";

  return `₦${num.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};
