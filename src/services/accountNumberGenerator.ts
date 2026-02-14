export function generateSecureAccountNumber(prefix: string = "88"): string {
  const randomPart = Math.floor(100000000 + Math.random() * 900000000).toString();
  const baseNumber = prefix + randomPart;

  let sum = 0;
  let shouldDouble = true;

  for (let i = baseNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(baseNumber.charAt(i));

    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    shouldDouble = !shouldDouble;
  }

  const checkDigit = (10 - (sum % 10)) % 10;
  return `${baseNumber}${checkDigit}`;
}