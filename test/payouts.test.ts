import { afterEach, describe, expect, it, vi } from "vitest";
import { RazorpayX } from "../src/index.js";
import { lastCall, mockFetchJson } from "./testUtils.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

const client = () => new RazorpayX({ keyId: "key", keySecret: "secret" });

describe("PayoutsResource", () => {
  it("creates a payout to an existing fund account with an idempotency key", async () => {
    const fetchMock = mockFetchJson(200, { id: "pout_123", entity: "payout", status: "processing" });

    await client().payouts.create(
      {
        account_number: "7878780080316316",
        fund_account_id: "fa_00000000000001",
        amount: 1000000,
        currency: "INR",
        mode: "IMPS",
        purpose: "refund",
      },
      "idem-key-123",
    );

    const call = lastCall(fetchMock);
    expect(call.method).toBe("POST");
    expect(call.url).toBe("https://api.razorpay.com/v1/payouts");
    expect(call.headers["X-Payout-Idempotency"]).toBe("idem-key-123");
    expect(call.body).toMatchObject({ fund_account_id: "fa_00000000000001", mode: "IMPS" });
  });

  it("omits the idempotency header when no key is provided", async () => {
    const fetchMock = mockFetchJson(200, { id: "pout_123", entity: "payout" });

    await client().payouts.create({
      account_number: "7878780080316316",
      fund_account_id: "fa_00000000000001",
      amount: 100,
      currency: "INR",
      mode: "UPI",
      purpose: "refund",
    });

    expect(lastCall(fetchMock).headers["X-Payout-Idempotency"]).toBeUndefined();
  });

  it("creates a composite payout with an inline contact and fund account", async () => {
    const fetchMock = mockFetchJson(200, { id: "pout_456", entity: "payout" });

    await client().payouts.createComposite({
      account_number: "7878780080316316",
      amount: 100,
      currency: "INR",
      mode: "UPI",
      purpose: "refund",
      fund_account: {
        account_type: "vpa",
        vpa: { address: "gaurav@exampleupi" },
        contact: { name: "Gaurav Kumar", type: "employee" },
      },
    });

    const call = lastCall(fetchMock);
    expect(call.body).toMatchObject({
      fund_account: { account_type: "vpa" },
    });
  });

  it("cancels a queued payout", async () => {
    const fetchMock = mockFetchJson(200, { id: "pout_123", entity: "payout", status: "cancelled" });

    await client().payouts.cancel("pout_123");

    const call = lastCall(fetchMock);
    expect(call.method).toBe("POST");
    expect(call.url).toBe("https://api.razorpay.com/v1/payouts/pout_123/cancel");
  });

  it("lists payouts scoped to an account number", async () => {
    const fetchMock = mockFetchJson(200, { entity: "collection", count: 0, items: [] });

    await client().payouts.all({ account_number: "7878780080316316", status: "processed" });

    expect(lastCall(fetchMock).url).toBe(
      "https://api.razorpay.com/v1/payouts?account_number=7878780080316316&status=processed",
    );
  });
});
