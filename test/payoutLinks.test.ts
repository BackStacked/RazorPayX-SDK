import { afterEach, describe, expect, it, vi } from "vitest";
import { RazorpayX } from "../src/index.js";
import { lastCall, mockFetchJson } from "./testUtils.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

const client = () => new RazorpayX({ keyId: "key", keySecret: "secret" });

describe("PayoutLinksResource", () => {
  it("creates a payout link using inline customer details", async () => {
    const fetchMock = mockFetchJson(200, { id: "poutlk_123", entity: "payout_link", status: "pending" });

    await client().payoutLinks.create({
      account_number: "7878780080316316",
      contact: { name: "Gaurav Kumar", contact: "9123456789", email: "gaurav@example.com" },
      amount: 1000,
      currency: "INR",
      purpose: "refund",
    });

    const call = lastCall(fetchMock);
    expect(call.method).toBe("POST");
    expect(call.url).toBe("https://api.razorpay.com/v1/payout-links");
    expect(call.body).toMatchObject({ contact: { name: "Gaurav Kumar" } });
  });

  it("creates a payout link using an existing contact id", async () => {
    const fetchMock = mockFetchJson(200, { id: "poutlk_124", entity: "payout_link" });

    await client().payoutLinks.create({
      account_number: "7878780080316316",
      contact: { id: "cont_123" },
      amount: 1000,
      currency: "INR",
      purpose: "refund",
    });

    expect(lastCall(fetchMock).body).toMatchObject({ contact: { id: "cont_123" } });
  });

  it("cancels a payout link", async () => {
    const fetchMock = mockFetchJson(200, { id: "poutlk_123", entity: "payout_link", status: "cancelled" });

    await client().payoutLinks.cancel("poutlk_123");

    expect(lastCall(fetchMock).url).toBe("https://api.razorpay.com/v1/payout-links/poutlk_123/cancel");
  });

  it("fetches a payout link by id", async () => {
    const fetchMock = mockFetchJson(200, { id: "poutlk_123", entity: "payout_link" });

    await client().payoutLinks.fetch("poutlk_123");

    expect(lastCall(fetchMock).method).toBe("GET");
    expect(lastCall(fetchMock).url).toBe("https://api.razorpay.com/v1/payout-links/poutlk_123");
  });
});
