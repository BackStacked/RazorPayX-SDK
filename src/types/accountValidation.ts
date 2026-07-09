import type { ListParams, Notes } from "./common.js";

export type FundAccountValidationStatus = "created" | "completed" | "failed";

export interface CreateFundAccountValidationParams {
  account_number: string;
  fund_account: { id: string };
  amount?: number;
  currency?: "INR";
  notes?: Notes;
}

export interface FundAccountValidation {
  id: string;
  entity: "fund_account.validation";
  fund_account_id: number;
  fund_account: {
    id: string;
    entity: "fund_account";
    contact_id: string;
    account_type: string;
    bank_account?: unknown;
    vpa?: unknown;
    active: boolean;
  };
  amount: number;
  currency: string;
  notes: Notes | [];
  status: FundAccountValidationStatus;
  results: {
    account_status: string;
    registered_name: string | null;
  } | null;
  created_at: number;
}

export type ListFundAccountValidationsParams = ListParams;
