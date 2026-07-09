import { afterEach, describe, expect, it, vi } from "vitest";
import { RazorpayX } from "../src/index.js";
import { lastCall, mockFetchJson } from "./testUtils.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

const client = () => new RazorpayX({ keyId: "key", keySecret: "secret" });

describe("FundAccountsResource", () => {
  it("creates a bank account fund account", async () => {
    const fetchMock = mockFetchJson(201, {
      id: "fa_123",
      entity: "fund_account",
      account_type: "bank_account",
    });

    await client().fundAccounts.create({
      contact_id: "cont_123",
      account_type: "bank_account",
      bank_account: { name: "Gaurav Kumar", ifsc: "HDFC0009107", account_number: "50100102283912" },
    });

    const call = lastCall(fetchMock);
    expect(call.method).toBe("POST");
    expect(call.url).toBe("https://api.razorpay.com/v1/fund_accounts");
    expect(call.body).toMatchObject({ account_type: "bank_account", contact_id: "cont_123" });
  });

  it("creates a VPA fund account", async () => {
    const fetchMock = mockFetchJson(201, { id: "fa_456", entity: "fund_account", account_type: "vpa" });

    await client().fundAccounts.create({
      contact_id: "cont_123",
      account_type: "vpa",
      vpa: { address: "gaurav@exampleupi" },
    });

    expect(lastCall(fetchMock).body).toEqual({
      contact_id: "cont_123",
      account_type: "vpa",
      vpa: { address: "gaurav@exampleupi" },
    });
  });

  it("deactivates a fund account", async () => {
    const fetchMock = mockFetchJson(200, { id: "fa_123", entity: "fund_account", active: false });

    await client().fundAccounts.deactivate("fa_123");

    const call = lastCall(fetchMock);
    expect(call.method).toBe("PATCH");
    expect(call.url).toBe("https://api.razorpay.com/v1/fund_accounts/fa_123");
    expect(call.body).toEqual({ active: false });
  });

  it("fetches all fund accounts for a contact", async () => {
    const fetchMock = mockFetchJson(200, { entity: "collection", count: 0, items: [] });

    await client().fundAccounts.all({ contact_id: "cont_123" });

    expect(lastCall(fetchMock).url).toBe("https://api.razorpay.com/v1/fund_accounts?contact_id=cont_123");
  });
});
