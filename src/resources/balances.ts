import type { HttpClient } from "../http.js";
import type { Balance, FetchBalanceParams } from "../types/balances.js";

export class BalancesResource {
  constructor(private readonly http: HttpClient) {}

  fetch(params?: FetchBalanceParams): Promise<Balance> {
    return this.http.request<Balance>("GET", "banking_balances", {
      query: params as Record<string, string | undefined>,
    });
  }
}
