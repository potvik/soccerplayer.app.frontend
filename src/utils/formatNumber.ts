const zeroDecimalsFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatZeroDecimals(value: number | string) {
  return zeroDecimalsFormatter.format(Number(value));
}

const twoDecimalsFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatWithTwoDecimals(value: number | string) {
  return twoDecimalsFormatter.format(Number(value));
}

export function formatWithTwoDecimalsRub(value: number) {
  return `${formatWithTwoDecimals(value)} ₽`;
}

export function ones(value: number | string) {
  return Number(value) / 1e18
}

export function truncateAddressString(address) {
  const first = address.slice(0, 6);
  const last = address.slice(-4);
  return `${first}...${last}`;
}
