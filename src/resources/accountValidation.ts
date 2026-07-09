import type { HttpClient } from "../http.js";
import type { RazorpayXCollection } from "../types/common.js";
import type {
  CreateFundAccountValidationParams,
  FundAccountValidation,
  ListFundAccountValidationsParams,
} from "../types/accountValidation.js";

export class AccountValidationResource {
  constructor(private readonly http: HttpClient) {}

  /** Validates a fund account (bank account or VPA) by creating a validation transaction. */
  create(params: CreateFundAccountValidationParams): Promise<FundAccountValidation> {
    return this.http.request<FundAccountValidation>("POST", "fund_accounts/validations", { body: params });
  }

  fetch(validationId: string): Promise<FundAccountValidation> {
    return this.http.request<FundAccountValidation>("GET", `fund_accounts/validations/${validationId}`);
  }

  all(params?: ListFundAccountValidationsParams): Promise<RazorpayXCollection<FundAccountValidation>> {
    return this.http.request<RazorpayXCollection<FundAccountValidation>>("GET", "fund_accounts/validations", {
      query: params as Record<string, string | number | boolean | undefined>,
    });
  }
}
