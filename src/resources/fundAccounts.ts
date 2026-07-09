import type { HttpClient } from "../http.js";
import type { RazorpayXCollection } from "../types/common.js";
import type { CreateFundAccountParams, FundAccount, ListFundAccountsParams } from "../types/fundAccounts.js";

export class FundAccountsResource {
  constructor(private readonly http: HttpClient) {}

  create(params: CreateFundAccountParams): Promise<FundAccount> {
    return this.http.request<FundAccount>("POST", "fund_accounts", { body: params });
  }

  fetch(fundAccountId: string): Promise<FundAccount> {
    return this.http.request<FundAccount>("GET", `fund_accounts/${fundAccountId}`);
  }

  activate(fundAccountId: string): Promise<FundAccount> {
    return this.http.request<FundAccount>("PATCH", `fund_accounts/${fundAccountId}`, { body: { active: true } });
  }

  deactivate(fundAccountId: string): Promise<FundAccount> {
    return this.http.request<FundAccount>("PATCH", `fund_accounts/${fundAccountId}`, { body: { active: false } });
  }

  all(params?: ListFundAccountsParams): Promise<RazorpayXCollection<FundAccount>> {
    return this.http.request<RazorpayXCollection<FundAccount>>("GET", "fund_accounts", {
      query: params as Record<string, string | number | boolean | undefined>,
    });
  }
}
