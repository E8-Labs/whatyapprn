export default function formatAmount(value) {
  if (value === null || value === undefined || value === "") return "";

  // Convert value to a string to ensure compatibility
  let sanitizedValue = String(value).replace(/[^0-9.]/g, '');

  // Ensure there's only one "."
  const parts = sanitizedValue.split('.');
  if (parts.length > 2) {
    sanitizedValue = `${parts[0]}.${parts[1]}`;
  }

  // Limit decimal places to 2
  if (sanitizedValue.includes('.')) {
    const [integer, decimal] = sanitizedValue.split('.');
    sanitizedValue = `${integer}.${decimal.slice(0, 2)}`;
  }

  // Add commas to the integer part
  const [integerPart, decimalPart] = sanitizedValue.split('.');
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  sanitizedValue = decimalPart !== undefined
    ? `${formattedInteger}.${decimalPart}`
    : formattedInteger;

  return sanitizedValue;
}
