import { HttpClient } from "./http.js";
import { ContactsResource } from "./resources/contacts.js";
import { FundAccountsResource } from "./resources/fundAccounts.js";
import { PayoutsResource } from "./resources/payouts.js";
import { PayoutLinksResource } from "./resources/payoutLinks.js";
import { TransactionsResource } from "./resources/transactions.js";
import { AccountValidationResource } from "./resources/accountValidation.js";
import { BalancesResource } from "./resources/balances.js";

export interface RazorpayXConfig {
  /** API Key ID from the Razorpay Dashboard (Settings -> API Keys). */
  keyId: string;
  /** API Key Secret from the Razorpay Dashboard. Never expose this on the client side. */
  keySecret: string;
  /** Overrides the API base URL. Defaults to `https://api.razorpay.com/v1/`. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30000. */
  timeout?: number;
}

export class RazorpayX {
  readonly contacts: ContactsResource;
  readonly fundAccounts: FundAccountsResource;
  readonly payouts: PayoutsResource;
  readonly payoutLinks: PayoutLinksResource;
  readonly transactions: TransactionsResource;
  readonly accountValidation: AccountValidationResource;
  readonly balances: BalancesResource;

  constructor(config: RazorpayXConfig) {
    if (!config.keyId || !config.keySecret) {
      throw new Error("RazorpayX: `keyId` and `keySecret` are required");
    }

    const authHeader = `Basic ${Buffer.from(`${config.keyId}:${config.keySecret}`).toString("base64")}`;
    const http = new HttpClient(config.baseUrl ?? "https://api.razorpay.com/v1/", authHeader, config.timeout ?? 30000);

    this.contacts = new ContactsResource(http);
    this.fundAccounts = new FundAccountsResource(http);
    this.payouts = new PayoutsResource(http);
    this.payoutLinks = new PayoutLinksResource(http);
    this.transactions = new TransactionsResource(http);
    this.accountValidation = new AccountValidationResource(http);
    this.balances = new BalancesResource(http);
  }
}
