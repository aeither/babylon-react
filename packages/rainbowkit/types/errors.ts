export enum ErrorState {
  SERVER_ERROR = 'SERVER_ERROR',
  UNBONDING = 'UNBONDING',
  WALLET = 'WALLET',
  WITHDRAW = 'WITHDRAW',
  STAKING = 'STAKING',
  TERMS = 'TERMS',
}

export interface ErrorType {
  message: string;
  errorState?: ErrorState;
}

export interface ErrorHandlerParam {
  error: Error | null;
  hasError: boolean;
  errorState: ErrorState;
  refetchFunction: () => void;
}

export interface ShowErrorParams {
  error: ErrorType;
  retryAction?: () => void;
  noCancel?: boolean;
}

export enum WalletErrorType {
  ConnectionCancelled = 'ConnectionCancelled',
}

export class WalletError extends Error {
  private type: WalletErrorType;
  constructor(type: WalletErrorType, message: string) {
    super(message);
    this.name = 'WalletError';
    this.type = type;
  }

  public getType(): WalletErrorType {
    return this.type;
  }
}
