export const satoshiToBtc = (satoshis: number): number => {
  return satoshis / 100000000;
};

export const maxDecimals = (value: number, decimals: number): number => {
  return Number(value.toFixed(decimals));
};