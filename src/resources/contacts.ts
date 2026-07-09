import type { HttpClient } from "../http.js";
import type { RazorpayXCollection } from "../types/common.js";
import type { Contact, CreateContactParams, ListContactsParams, UpdateContactParams } from "../types/contacts.js";

export class ContactsResource {
  constructor(private readonly http: HttpClient) {}

  create(params: CreateContactParams): Promise<Contact> {
    return this.http.request<Contact>("POST", "contacts", { body: params });
  }

  fetch(contactId: string): Promise<Contact> {
    return this.http.request<Contact>("GET", `contacts/${contactId}`);
  }

  update(contactId: string, params: UpdateContactParams): Promise<Contact> {
    return this.http.request<Contact>("PATCH", `contacts/${contactId}`, { body: params });
  }

  activate(contactId: string): Promise<Contact> {
    return this.http.request<Contact>("PATCH", `contacts/${contactId}`, { body: { active: true } });
  }

  deactivate(contactId: string): Promise<Contact> {
    return this.http.request<Contact>("PATCH", `contacts/${contactId}`, { body: { active: false } });
  }

  all(params?: ListContactsParams): Promise<RazorpayXCollection<Contact>> {
    return this.http.request<RazorpayXCollection<Contact>>("GET", "contacts", {
      query: params as Record<string, string | number | boolean | undefined>,
    });
  }
}
