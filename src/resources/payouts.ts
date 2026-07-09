import type { HttpClient } from "../http.js";
import type { RazorpayXCollection } from "../types/common.js";
import type {
  CreateCompositePayoutParams,
  CreatePayoutParams,
  ListPayoutsParams,
  Payout,
} from "../types/payouts.js";

export class PayoutsResource {
  constructor(private readonly http: HttpClient) {}

  /**
   * Creates a payout to an existing fund account. Pass `idempotencyKey` to
   * safely retry a request without risking a duplicate payout, sent as the
   * `X-Payout-Idempotency` header.
   */
  create(params: CreatePayoutParams, idempotencyKey?: string): Promise<Payout> {
    return this.http.request<Payout>("POST", "payouts", {
      body: params,
      headers: idempotencyKey ? { "X-Payout-Idempotency": idempotencyKey } : undefined,
    });
  }

  /**
   * Creates a payout using the Composite API: the contact and fund account
   * are created in the same call instead of referencing an existing one.
   */
  createComposite(params: CreateCompositePayoutParams, idempotencyKey?: string): Promise<Payout> {
    return this.http.request<Payout>("POST", "payouts", {
      body: params,
      headers: idempotencyKey ? { "X-Payout-Idempotency": idempotencyKey } : undefined,
    });
  }

  fetch(payoutId: string): Promise<Payout> {
    return this.http.request<Payout>("GET", `payouts/${payoutId}`);
  }

  /** Only payouts in the `queued` state can be cancelled. */
  cancel(payoutId: string): Promise<Payout> {
    return this.http.request<Payout>("POST", `payouts/${payoutId}/cancel`);
  }

  all(params: ListPayoutsParams): Promise<RazorpayXCollection<Payout>> {
    return this.http.request<RazorpayXCollection<Payout>>("GET", "payouts", {
      query: params as unknown as Record<string, string | number | boolean | undefined>,
    });
  }
}
