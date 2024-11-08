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

export const getStakingTerm = (params: GlobalParamsVersion, term: number) => {
  // check if term is fixed
  let termWithFixed: number;
  if (params && params.minStakingTimeBlocks === params.maxStakingTimeBlocks) {
    // if term is fixed, use the API value
    termWithFixed = params.minStakingTimeBlocks;
  } else {
    // if term is not fixed, use the term from the input
    termWithFixed = term;
  }
  return termWithFixed;
};
