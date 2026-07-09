import type { ListParams } from "./common.js";

export interface BankAccountDetails {
  name: string;
  ifsc: string;
  account_number: string;
}

export interface BankAccountDetailsResponse extends BankAccountDetails {
  bank_name?: string;
  notes?: unknown[];
}

export interface VpaDetails {
  address: string;
}

export interface VpaDetailsResponse {
  username: string;
  handle: string;
  address: string;
}

export interface CardDetails {
  name: string;
  number: string;
}

export interface CreateBankAccountFundAccountParams {
  contact_id: string;
  account_type: "bank_account";
  bank_account: BankAccountDetails;
}

export interface CreateVpaFundAccountParams {
  contact_id: string;
  account_type: "vpa";
  vpa: VpaDetails;
}

export interface CreateCardFundAccountParams {
  contact_id: string;
  account_type: "card";
  card: CardDetails;
}

export type CreateFundAccountParams =
  | CreateBankAccountFundAccountParams
  | CreateVpaFundAccountParams
  | CreateCardFundAccountParams;

interface FundAccountBase {
  id: string;
  entity: "fund_account";
  contact_id: string;
  batch_id: string | null;
  active: boolean;
  created_at: number;
}

export interface BankAccountFundAccount extends FundAccountBase {
  account_type: "bank_account";
  bank_account: BankAccountDetailsResponse;
}

export interface VpaFundAccount extends FundAccountBase {
  account_type: "vpa";
  vpa: VpaDetailsResponse;
}

export interface CardFundAccount extends FundAccountBase {
  account_type: "card";
  card: CardDetails & { last4?: string; network?: string; type?: string; sub_type?: string };
}

export type FundAccount = BankAccountFundAccount | VpaFundAccount | CardFundAccount;

export interface ListFundAccountsParams extends ListParams {
  contact_id?: string;
}
