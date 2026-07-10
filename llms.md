# razorpayx-sdk — LLM reference

Condensed API reference for `razorpayx-sdk`, an unofficial, zero-dependency Node.js/TypeScript SDK for the RazorpayX API. Written for LLMs/coding agents generating code against this package — for prose and examples see [README.md](README.md).

- Requires Node.js >= 18 (uses global `fetch`).
- Ships ESM (`import`) and CJS (`require`) builds; all types are exported from the package root.
- All amounts are integers in the smallest currency unit (paise for INR): ₹1,000.00 = `100000`.
- Every resource method returns a `Promise` that resolves to parsed JSON, or rejects with `RazorpayXError`.
- There is no default export. Always import named `RazorpayX`.

## Install & construct

```ts
import { RazorpayX } from "razorpayx-sdk";

const client = new RazorpayX({
  keyId: string,       // required
  keySecret: string,   // required
  baseUrl?: string,    // default "https://api.razorpay.com/v1/"
  timeout?: number,    // default 30000 (ms)
});
```

Throws a plain `Error` synchronously if `keyId` or `keySecret` is falsy. Does not read env vars itself — pass `process.env.X` explicitly.

## Error handling

```ts
import { RazorpayXError } from "razorpayx-sdk";

try {
  await client.payouts.create({ ... });
} catch (err) {
  if (err instanceof RazorpayXError) {
    err.statusCode; // number, HTTP status (0 if the request timed out)
    err.code;       // string | undefined, e.g. "BAD_REQUEST_ERROR"
    err.message;    // string, human-readable description
    err.field;      // string | null | undefined
    err.source;     // string | null | undefined
    err.step;       // string | null | undefined
    err.reason;     // string | null | undefined
    err.metadata;   // Record<string, unknown> | undefined
  }
}
```

Any non-2xx response throws `RazorpayXError`. Network errors and other thrown errors pass through unchanged. A request that exceeds `timeout` throws `RazorpayXError` with `statusCode: 0`.

## client.contacts

| Method | Signature | HTTP |
|---|---|---|
| `create` | `(params: CreateContactParams) => Promise<Contact>` | `POST /contacts` |
| `fetch` | `(contactId: string) => Promise<Contact>` | `GET /contacts/:id` |
| `update` | `(contactId: string, params: UpdateContactParams) => Promise<Contact>` | `PATCH /contacts/:id` |
| `activate` | `(contactId: string) => Promise<Contact>` | `PATCH /contacts/:id` `{ active: true }` |
| `deactivate` | `(contactId: string) => Promise<Contact>` | `PATCH /contacts/:id` `{ active: false }` |
| `all` | `(params?: ListContactsParams) => Promise<RazorpayXCollection<Contact>>` | `GET /contacts` |

```ts
interface CreateContactParams {
  name?: string;
  email?: string;
  contact?: string | number;
  type?: "employee" | "vendor" | "customer" | "self";
  reference_id?: string;
  notes?: Record<string, string>;
}
// UpdateContactParams = CreateContactParams & { active?: boolean }
// ListContactsParams = { name?, email?, contact?, reference_id?, active?, from?, to?, count?, skip? }
```

## client.fundAccounts

Fund accounts belong to a contact and are the target of payouts. `account_type` is a discriminated union — pick exactly one shape.

| Method | Signature | HTTP |
|---|---|---|
| `create` | `(params: CreateFundAccountParams) => Promise<FundAccount>` | `POST /fund_accounts` |
| `fetch` | `(fundAccountId: string) => Promise<FundAccount>` | `GET /fund_accounts/:id` |
| `activate` | `(fundAccountId: string) => Promise<FundAccount>` | `PATCH /fund_accounts/:id` `{ active: true }` |
| `deactivate` | `(fundAccountId: string) => Promise<FundAccount>` | `PATCH /fund_accounts/:id` `{ active: false }` |
| `all` | `(params?: ListFundAccountsParams) => Promise<RazorpayXCollection<FundAccount>>` | `GET /fund_accounts` |

```ts
type CreateFundAccountParams =
  | { contact_id: string; account_type: "bank_account"; bank_account: { name: string; ifsc: string; account_number: string } }
  | { contact_id: string; account_type: "vpa"; vpa: { address: string } }
  | { contact_id: string; account_type: "card"; card: { name: string; number: string } };
// ListFundAccountsParams = { contact_id?, from?, to?, count?, skip? }
```

## client.payouts

Two ways to create a payout: `create` (against an existing `fund_account_id`) or `createComposite` (inline contact + fund account in one call). Both accept an optional `idempotencyKey` second argument, sent as the `X-Payout-Idempotency` header — pass a UUID to safely retry without risking a duplicate payout.

| Method | Signature | HTTP |
|---|---|---|
| `create` | `(params: CreatePayoutParams, idempotencyKey?: string) => Promise<Payout>` | `POST /payouts` |
| `createComposite` | `(params: CreateCompositePayoutParams, idempotencyKey?: string) => Promise<Payout>` | `POST /payouts` |
| `fetch` | `(payoutId: string) => Promise<Payout>` | `GET /payouts/:id` |
| `cancel` | `(payoutId: string) => Promise<Payout>` | `POST /payouts/:id/cancel` |
| `all` | `(params: ListPayoutsParams) => Promise<RazorpayXCollection<Payout>>` | `GET /payouts` |

```ts
type PayoutMode = "NEFT" | "RTGS" | "IMPS" | "UPI" | "card" | "amazonpay";
type PayoutStatus = "queued" | "pending" | "rejected" | "processing" | "processed" | "cancelled" | "reversed" | "failed";

interface CreatePayoutParams {
  account_number: string;   // your RazorpayX virtual/current account number
  fund_account_id: string;
  amount: number;           // smallest currency unit
  currency: "INR";
  mode: PayoutMode;
  purpose: string;          // e.g. "refund", "cashback", "salary", "vendor_bill"
  queue_if_low_balance?: boolean;
  reference_id?: string;
  narration?: string;
  notes?: Record<string, string>;
}

// CreateCompositePayoutParams = same base fields, but instead of fund_account_id:
interface CreateCompositePayoutParams extends /* base above minus fund_account_id */ {
  fund_account:
    | { account_type: "bank_account"; bank_account: {...}; contact: PayoutFundAccountContact }
    | { account_type: "vpa"; vpa: {...}; contact: PayoutFundAccountContact }
    | { account_type: "card"; card: {...}; contact: PayoutFundAccountContact };
}
interface PayoutFundAccountContact {
  name: string; email?: string; contact?: string;
  type?: "employee" | "vendor" | "customer" | "self";
  reference_id?: string; notes?: Record<string, string>;
}

// ListPayoutsParams = { account_number: string (required); fund_account_id?, contact_id?, mode?, status?, from?, to?, count?, skip? }
```

`cancel` only succeeds for payouts in the `queued` state — RazorpayX rejects cancellation of any other status.

## client.payoutLinks

For contacts whose fund account details you don't have yet — RazorpayX hosts a page to collect them, then pays out.

| Method | Signature | HTTP |
|---|---|---|
| `create` | `(params: CreatePayoutLinkParams) => Promise<PayoutLink>` | `POST /payout-links` |
| `fetch` | `(payoutLinkId: string) => Promise<PayoutLink>` | `GET /payout-links/:id` |
| `cancel` | `(payoutLinkId: string) => Promise<PayoutLink>` | `POST /payout-links/:id/cancel` |
| `all` | `(params?: ListPayoutLinkParams) => Promise<RazorpayXCollection<PayoutLink>>` | `GET /payout-links` |

```ts
interface CreatePayoutLinkParams {
  account_number: string;
  contact: { id: string } | { name: string; contact: string; email?: string; type?: ContactType };
  amount: number;
  currency: "INR";
  purpose: string;
  description?: string;
  receipt?: string;
  send_sms?: boolean;
  send_email?: boolean;
  notes?: Record<string, string>;
}
// ListPayoutLinkParams = { account_number?, contact_id?, from?, to?, count?, skip? }
```

## client.transactions

Read-only ledger of inflows, payouts, and reversals against your account.

| Method | Signature | HTTP |
|---|---|---|
| `fetch` | `(transactionId: string) => Promise<Transaction>` | `GET /transactions/:id` |
| `all` | `(params: ListTransactionsParams) => Promise<RazorpayXCollection<Transaction>>` | `GET /transactions` |

```ts
// ListTransactionsParams = { account_number: string (required); from?, to?, count?, skip? }
```

## client.accountValidation

Validates a fund account's bank details / VPA (a.k.a. "penny testing") before you rely on it for payouts.

| Method | Signature | HTTP |
|---|---|---|
| `create` | `(params: CreateFundAccountValidationParams) => Promise<FundAccountValidation>` | `POST /fund_accounts/validations` |
| `fetch` | `(validationId: string) => Promise<FundAccountValidation>` | `GET /fund_accounts/validations/:id` |
| `all` | `(params?: ListFundAccountValidationsParams) => Promise<RazorpayXCollection<FundAccountValidation>>` | `GET /fund_accounts/validations` |

```ts
interface CreateFundAccountValidationParams {
  account_number: string;
  fund_account: { id: string };
  amount?: number;
  currency?: "INR";
  notes?: Record<string, string>;
}
```

## client.balances

| Method | Signature | HTTP |
|---|---|---|
| `fetch` | `(params?: { account_number?: string }) => Promise<Balance>` | `GET /banking_balances` |

## Shared types

```ts
interface RazorpayXCollection<T> {
  entity: "collection";
  count: number;
  items: T[];
}
```

## Common mistakes to avoid when generating code against this SDK

- Don't pass rupees — amounts are paise (integers). `amount: 500` is ₹5.00, not ₹500.
- `payouts.all` and `transactions.all` require `account_number` in params (not optional), unlike most other `all()` methods.
- `fundAccounts.create` needs exactly one of `bank_account` / `vpa` / `card` matching `account_type` — don't include the others.
- The idempotency key on `payouts.create`/`createComposite` is a plain function argument, not a field inside `params`.
- Import types from the package root (`razorpayx-sdk`), not from internal paths like `razorpayx-sdk/dist/types/...` — internals aren't part of the public API surface.
