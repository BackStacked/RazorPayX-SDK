import { afterEach, describe, expect, it, vi } from "vitest";
import { RazorpayX } from "../src/index.js";
import { lastCall, mockFetchJson } from "./testUtils.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

const client = () => new RazorpayX({ keyId: "key", keySecret: "secret" });

describe("BalancesResource", () => {
  it("fetches the account balance", async () => {
    const fetchMock = mockFetchJson(200, {
      id: "acc_123",
      entity: "balance",
      name: "escrow",
      balance: 122313800,
      account_number: "7878780080316316",
      currency: "INR",
      type: "current",
    });

    const balance = await client().balances.fetch({ account_number: "7878780080316316" });

    const call = lastCall(fetchMock);
    expect(call.method).toBe("GET");
    expect(call.url).toBe("https://api.razorpay.com/v1/banking_balances?account_number=7878780080316316");
    expect(balance.balance).toBe(122313800);
  });

  it("fetches the account balance without params", async () => {
    const fetchMock = mockFetchJson(200, { id: "acc_123", entity: "balance" });

    await client().balances.fetch();

    expect(lastCall(fetchMock).url).toBe("https://api.razorpay.com/v1/banking_balances");
  });
});
