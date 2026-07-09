import type { HttpClient } from "../http.js";
import type { RazorpayXCollection } from "../types/common.js";
import type { CreatePayoutLinkParams, ListPayoutLinkParams, PayoutLink } from "../types/payoutLinks.js";

export class PayoutLinksResource {
  constructor(private readonly http: HttpClient) {}

  create(params: CreatePayoutLinkParams): Promise<PayoutLink> {
    return this.http.request<PayoutLink>("POST", "payout-links", { body: params });
  }

  fetch(payoutLinkId: string): Promise<PayoutLink> {
    return this.http.request<PayoutLink>("GET", `payout-links/${payoutLinkId}`);
  }

  cancel(payoutLinkId: string): Promise<PayoutLink> {
    return this.http.request<PayoutLink>("POST", `payout-links/${payoutLinkId}/cancel`);
  }

  all(params?: ListPayoutLinkParams): Promise<RazorpayXCollection<PayoutLink>> {
    return this.http.request<RazorpayXCollection<PayoutLink>>("GET", "payout-links", {
      query: params as Record<string, string | number | boolean | undefined>,
    });
  }
}
