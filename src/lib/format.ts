const zarFormatter = new Intl.NumberFormat('en-ZA', {
  style: 'decimal',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

/**
 * Format whole Rands as R4,500 with a forced comma thousands separator.
 */
export function formatZAR(amount: number): string {
  const formatted = zarFormatter.format(Math.round(amount));
  // en-ZA may use a narrow no-break space or period depending on runtime; force comma style.
  const withCommas = formatted.replace(/[\u00A0\u202F\s.]/g, ',').replace(/,+/g, ',');
  return `R${withCommas}`;
}
