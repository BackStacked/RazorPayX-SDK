import { afterEach, describe, expect, it, vi } from "vitest";
import { RazorpayX } from "../src/index.js";
import { lastCall, mockFetchJson } from "./testUtils.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

const client = () => new RazorpayX({ keyId: "key", keySecret: "secret" });

describe("TransactionsResource", () => {
  it("lists transactions for an account number", async () => {
    const fetchMock = mockFetchJson(200, { entity: "collection", count: 0, items: [] });

    await client().transactions.all({ account_number: "7878780080316316", count: 10 });

    expect(lastCall(fetchMock).url).toBe(
      "https://api.razorpay.com/v1/transactions?account_number=7878780080316316&count=10",
    );
  });

  it("fetches a transaction by id", async () => {
    const fetchMock = mockFetchJson(200, { id: "txn_123", entity: "transaction" });

    await client().transactions.fetch("txn_123");

    expect(lastCall(fetchMock).url).toBe("https://api.razorpay.com/v1/transactions/txn_123");
  });
});
