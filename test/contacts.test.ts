import { afterEach, describe, expect, it, vi } from "vitest";
import { RazorpayX } from "../src/index.js";
import { lastCall, mockFetchJson } from "./testUtils.js";

afterEach(() => {
  vi.unstubAllGlobals();
});

const client = () => new RazorpayX({ keyId: "key", keySecret: "secret" });

describe("ContactsResource", () => {
  it("creates a contact", async () => {
    const fetchMock = mockFetchJson(200, { id: "cont_123", entity: "contact", active: true });

    const contact = await client().contacts.create({ name: "Gaurav Kumar", type: "employee" });

    const call = lastCall(fetchMock);
    expect(call.method).toBe("POST");
    expect(call.url).toBe("https://api.razorpay.com/v1/contacts");
    expect(call.body).toEqual({ name: "Gaurav Kumar", type: "employee" });
    expect(contact.id).toBe("cont_123");
  });

  it("updates a contact", async () => {
    const fetchMock = mockFetchJson(200, { id: "cont_123", entity: "contact" });

    await client().contacts.update("cont_123", { name: "Updated Name" });

    const call = lastCall(fetchMock);
    expect(call.method).toBe("PATCH");
    expect(call.url).toBe("https://api.razorpay.com/v1/contacts/cont_123");
    expect(call.body).toEqual({ name: "Updated Name" });
  });

  it("activates and deactivates a contact", async () => {
    const fetchMock = mockFetchJson(200, { id: "cont_123", entity: "contact", active: false });

    await client().contacts.deactivate("cont_123");

    expect(lastCall(fetchMock).body).toEqual({ active: false });
  });

  it("lists contacts with query params", async () => {
    const fetchMock = mockFetchJson(200, { entity: "collection", count: 0, items: [] });

    await client().contacts.all({ count: 5, active: true });

    const call = lastCall(fetchMock);
    expect(call.url).toBe("https://api.razorpay.com/v1/contacts?count=5&active=true");
  });
});
