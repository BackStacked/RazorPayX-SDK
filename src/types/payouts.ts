import type { ListParams, Notes } from "./common.js";
import type { BankAccountDetails, CardDetails, VpaDetails } from "./fundAccounts.js";
import type { ContactType } from "./contacts.js";

export type PayoutMode = "NEFT" | "RTGS" | "IMPS" | "UPI" | "card" | "amazonpay";

export type PayoutStatus =
  | "queued"
  | "pending"
  | "rejected"
  | "processing"
  | "processed"
  | "cancelled"
  | "reversed"
  | "failed";

export interface PayoutFundAccountContact {
  name: string;
  email?: string;
  contact?: string;
  type?: ContactType;
  reference_id?: string;
  notes?: Notes;
}

export type CompositeFundAccount =
  | { account_type: "bank_account"; bank_account: BankAccountDetails; contact: PayoutFundAccountContact }
  | { account_type: "vpa"; vpa: VpaDetails; contact: PayoutFundAccountContact }
  | { account_type: "card"; card: CardDetails; contact: PayoutFundAccountContact };

interface CreatePayoutBase {
  account_number: string;
  amount: number;
  currency: "INR";
  mode: PayoutMode;
  purpose: string;
  queue_if_low_balance?: boolean;
  reference_id?: string;
  narration?: string;
  notes?: Notes;
}

/** Payout to an existing fund account. */
export interface CreatePayoutParams extends CreatePayoutBase {
  fund_account_id: string;
}

/** Composite payout: creates the contact and fund account in the same call. */
export interface CreateCompositePayoutParams extends CreatePayoutBase {
  fund_account: CompositeFundAccount;
}

export interface Payout {
  id: string;
  entity: "payout";
  fund_account_id: string;
  amount: number;
  currency: string;
  notes: Notes | [];
  fees: number;
  tax: number;
  status: PayoutStatus;
  purpose: string;
  utr: string | null;
  mode: PayoutMode;
  reference_id: string | null;
  narration: string | null;
  batch_id: string | null;
  failure_reason: string | null;
  created_at: number;
}

export interface ListPayoutsParams extends ListParams {
  account_number: string;
  fund_account_id?: string;
  contact_id?: string;
  mode?: PayoutMode;
  status?: PayoutStatus;
}
