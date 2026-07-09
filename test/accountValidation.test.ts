import { afterEach, describe, expect, it, vi } from "vitest";
import { RazorpayX } from "../src/index.js";
import { lastCall, mockFetchJson } from "./testUtils.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

const client = () => new RazorpayX({ keyId: "key", keySecret: "secret" });

describe("AccountValidationResource", () => {
  it("creates a fund account validation", async () => {
    const fetchMock = mockFetchJson(200, { id: "fav_123", entity: "fund_account.validation", status: "created" });

    await client().accountValidation.create({
      account_number: "7878780080316316",
      fund_account: { id: "fa_123" },
      amount: 100,
    });

    const call = lastCall(fetchMock);
    expect(call.method).toBe("POST");
    expect(call.url).toBe("https://api.razorpay.com/v1/fund_accounts/validations");
    expect(call.body).toMatchObject({ fund_account: { id: "fa_123" } });
  });

  it("fetches a validation by id", async () => {
    const fetchMock = mockFetchJson(200, { id: "fav_123", entity: "fund_account.validation" });

    await client().accountValidation.fetch("fav_123");

    expect(lastCall(fetchMock).url).toBe("https://api.razorpay.com/v1/fund_accounts/validations/fav_123");
  });

  it("lists all validations", async () => {
    const fetchMock = mockFetchJson(200, { entity: "collection", count: 0, items: [] });

    await client().accountValidation.all({ count: 20 });

    expect(lastCall(fetchMock).url).toBe("https://api.razorpay.com/v1/fund_accounts/validations?count=20");
  });
});
