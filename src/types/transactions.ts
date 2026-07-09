export interface Transaction {
  id: string;
  entity: "transaction";
  account_number: string;
  amount: number;
  currency: string;
  credit: number;
  debit: number;
  balance: number;
  source: {
    id: string;
    entity: string;
    [key: string]: unknown;
  };
  notes: Record<string, string> | [];
  balance_id: string;
  created_at: number;
}

export interface ListTransactionsParams {
  account_number: string;
  from?: number;
  to?: number;
  count?: number;
  skip?: number;
}
