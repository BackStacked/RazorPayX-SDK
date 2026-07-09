import type { ListParams, Notes } from "./common.js";
import type { ContactType } from "./contacts.js";

export type PayoutLinkStatus = "pending" | "processing" | "processed" | "cancelled" | "rejected";

export type PayoutLinkContact = { id: string } | { name: string; contact: string; email?: string; type?: ContactType };

export interface CreatePayoutLinkParams {
  account_number: string;
  contact: PayoutLinkContact;
  amount: number;
  currency: "INR";
  purpose: string;
  description?: string;
  receipt?: string;
  send_sms?: boolean;
  send_email?: boolean;
  notes?: Notes;
}

export interface PayoutLink {
  id: string;
  entity: "payout_link";
  contact: {
    id?: string;
    name: string;
    contact: string;
    email: string;
  };
  contact_id: string;
  fund_account_id: string | null;
  purpose: string;
  status: PayoutLinkStatus;
  amount: number;
  currency: string;
  description: string | null;
  short_url: string;
  send_sms?: boolean;
  send_email?: boolean;
  attempt_count: number;
  user_id: string;
  receipt: string | null;
  cancelled_at?: number;
  notes: Notes | [];
  created_at: number;
}

export interface ListPayoutLinkParams extends ListParams {
  account_number?: string;
  contact_id?: string;
}
