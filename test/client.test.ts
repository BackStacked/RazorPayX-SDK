import { afterEach, describe, expect, it, vi } from "vitest";
import { RazorpayX, RazorpayXError } from "../src/index.js";
import { lastCall, mockFetchJson } from "./testUtils.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("RazorpayX client", () => {
  it("throws if keyId or keySecret is missing", () => {
    expect(() => new RazorpayX({ keyId: "", keySecret: "secret" })).toThrow();
    expect(() => new RazorpayX({ keyId: "key", keySecret: "" })).toThrow();
  });

  it("sends a Basic Auth header derived from keyId/keySecret", async () => {
    const fetchMock = mockFetchJson(200, { id: "cont_123", entity: "contact" });
    const client = new RazorpayX({ keyId: "rzp_test_key", keySecret: "rzp_test_secret" });

    await client.contacts.fetch("cont_123");

    const call = lastCall(fetchMock);
    const expected = `Basic ${Buffer.from("rzp_test_key:rzp_test_secret").toString("base64")}`;
    expect(call.headers.Authorization).toBe(expected);
    expect(call.method).toBe("GET");
    expect(call.url).toBe("https://api.razorpay.com/v1/contacts/cont_123");
  });

  it("respects a custom baseUrl", async () => {
    const fetchMock = mockFetchJson(200, { entity: "collection", count: 0, items: [] });
    const client = new RazorpayX({
      keyId: "key",
      keySecret: "secret",
      baseUrl: "https://sandbox.example.com/v1/",
    });

    await client.contacts.all();

    expect(lastCall(fetchMock).url).toBe("https://sandbox.example.com/v1/contacts");
  });

  it("throws a RazorpayXError with parsed details on API failure", async () => {
    mockFetchJson(400, {
      error: {
        code: "BAD_REQUEST_ERROR",
        description: "The api key/secret provided is invalid",
        field: null,
        source: "business",
        step: "payment_initiation",
        reason: "input_validation_failed",
        metadata: {},
      },
    });
    const client = new RazorpayX({ keyId: "key", keySecret: "secret" });

    await expect(client.contacts.fetch("cont_123")).rejects.toMatchObject({
      name: "RazorpayXError",
      statusCode: 400,
      code: "BAD_REQUEST_ERROR",
      message: "The api key/secret provided is invalid",
      reason: "input_validation_failed",
    });
    await expect(client.contacts.fetch("cont_123")).rejects.toBeInstanceOf(RazorpayXError);
  });
});
