import type { AxiosResponse } from "axios";


import { apiWrapper } from "./apiWrapper";

export interface GlobalParamsVersion {
  version: number;
  activationHeight: number;
  stakingCapSat: number;
  stakingCapHeight: number;
  tag: string;
  covenantPks: string[];
  covenantQuorum: number;
  unbondingTime: number;
  unbondingFeeSat: number;
  maxStakingAmountSat: number;
  minStakingAmountSat: number;
  maxStakingTimeBlocks: number;
  minStakingTimeBlocks: number;
  confirmationDepth: number;
}


interface GlobalParamsDataResponse {
  versions: {
    version: number;
    activation_height: number;
    staking_cap: number;
    cap_height: number;
    tag: string;
    covenant_pks: string[];
    covenant_quorum: number;
    unbonding_time: number;
    unbonding_fee: number;
    max_staking_amount: number;
    min_staking_amount: number;
    max_staking_time: number;
    min_staking_time: number;
    confirmation_depth: number;
  }[];
}

export const getGlobalParams = async (): Promise<GlobalParamsVersion[]> => {
  const { data } = (await apiWrapper(
    "GET",
    "/v1/global-params",
    "Error getting global params",
  )) as AxiosResponse<{ data: GlobalParamsDataResponse }>;
  const { versions } = data.data;

  // covert them into GlobalParamsVersion
  return versions.map((v) => ({
    version: v.version,
    activationHeight: v.activation_height,
    stakingCapSat: v.staking_cap,
    stakingCapHeight: v.cap_height,
    tag: v.tag,
    covenantPks: v.covenant_pks,
    covenantQuorum: v.covenant_quorum,
    unbondingTime: v.unbonding_time,
    unbondingFeeSat: v.unbonding_fee,
    maxStakingAmountSat: v.max_staking_amount,
    minStakingAmountSat: v.min_staking_amount,
    maxStakingTimeBlocks: v.max_staking_time,
    minStakingTimeBlocks: v.min_staking_time,
    confirmationDepth: v.confirmation_depth,
  }));
};
