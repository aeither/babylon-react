// biome-ignore lint/style/useImportType: <explanation>
import React from "react";
import { maxDecimals, satoshiToBtc } from "../utils/bitcoin";

interface BalanceProps {
  balanceSat?: number;
  loading?: boolean;
}

export const Balance: React.FC<BalanceProps> = ({ balanceSat, loading }) => {
  if (loading) return <div>Loading...</div>;
  if (typeof balanceSat === 'undefined') return null;

  return (
    <div className="flex items-center gap-1">
      <span className="font-semibold">
        {maxDecimals(satoshiToBtc(balanceSat), 8)}
      </span>
      <span>BTC</span>
    </div>
  );
};
