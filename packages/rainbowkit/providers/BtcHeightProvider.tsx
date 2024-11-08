import { useQuery } from "@tanstack/react-query";
// biome-ignore lint/style/useImportType: <explanation>
import React, { type ReactNode, createContext, useContext } from "react";

import { getTipHeight } from "../providers/mempool_api";

interface BtcHeightProviderProps {
  children: ReactNode;
}

const BtcHeightContext = createContext<number | undefined>(undefined);

export const BtcHeightProvider: React.FC<BtcHeightProviderProps> = ({
  children,
}) => {
  const { data } = useQuery({
    queryKey: ["BTC_HEIGHT_MEMPOOL_API"],
    queryFn: async () => getTipHeight(),
    refetchInterval: 60000, // 1 minute
  });

  return (
    <BtcHeightContext.Provider value={data}>
      {children}
    </BtcHeightContext.Provider>
  );
};

/*
 * BTC Height Context. Provides the current BTC height from the mempool API.
 * Note: This value is for information display only.
 * Not suppose to be used for staking or other critical operations.
 */
export const useBtcHeight = () => useContext(BtcHeightContext);
