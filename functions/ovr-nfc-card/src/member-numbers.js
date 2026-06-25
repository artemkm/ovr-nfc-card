function formatCardPrintNumber(memberNumber) {
  const digits = String(memberNumber || '').replace(/\D/g, '');

  if (digits.length !== 8) {
    return '';
  }

  return `${digits.slice(0, 4)} ${digits.slice(4)}`;
}

module.exports = { formatCardPrintNumber };
