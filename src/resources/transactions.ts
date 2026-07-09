import type { HttpClient } from "../http.js";
import type { RazorpayXCollection } from "../types/common.js";
import type { ListTransactionsParams, Transaction } from "../types/transactions.js";

export class TransactionsResource {
  constructor(private readonly http: HttpClient) {}

  fetch(transactionId: string): Promise<Transaction> {
    return this.http.request<Transaction>("GET", `transactions/${transactionId}`);
  }

  all(params: ListTransactionsParams): Promise<RazorpayXCollection<Transaction>> {
    return this.http.request<RazorpayXCollection<Transaction>>("GET", "transactions", {
      query: params as unknown as Record<string, string | number | boolean | undefined>,
    });
  }
}
