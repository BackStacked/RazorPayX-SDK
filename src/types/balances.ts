export interface Balance {
  id: string;
  entity: "balance";
  name: string;
  balance: number;
  account_number: string;
  currency: string;
  type: string;
}

export interface FetchBalanceParams {
  account_number?: string;
}
