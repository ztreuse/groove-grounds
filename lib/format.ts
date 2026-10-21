const peso = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 0,
});

// Whole pesos, e.g. ₱170.
export function formatPeso(amount: number) {
  return peso.format(amount);
}
