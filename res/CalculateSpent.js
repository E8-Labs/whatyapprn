export default function calculateSpent(spent) {
  // console.log('spent', spent);

  if (spent === 0) {
    return "$0";
  }

  const numericAmount = parseFloat(spent);

  if (isNaN(numericAmount)) {
    return ""; // Return an empty string for invalid numbers
  }

  let spentAmount = 0;

  if (numericAmount > 100 && numericAmount < 1000) {
    spentAmount = Math.floor(numericAmount / 50) * 50;
    return `$${spentAmount}+`;
  } else if (numericAmount >= 1000 && numericAmount < 1000000) {
    spentAmount = (numericAmount / 1000).toFixed(1); 
    return `$${spentAmount}K`;
  } else if (numericAmount >= 1000000) {
    spentAmount = (numericAmount / 1000000).toFixed(2);
    return `$${spentAmount}M`;
  }

  // Handle amounts <= 100
  return `$${numericAmount}`;
}
