# razorpayx-sdk

An unofficial, dependency-free Node.js SDK for the [RazorpayX](https://razorpay.com/docs/api/razorpayx/) API, written in TypeScript. It covers Contacts, Fund Accounts, Payouts (including the Composite API), Payout Links, Transactions, Account Validation, and Balances.

- Zero runtime dependencies — uses the global `fetch` built into Node.js 18+.
- Fully typed requests and responses.
- Ships both ESM and CommonJS builds.
- Throws a single `RazorpayXError` with the parsed Razorpay error payload on failure.

> This is a community SDK and is not published or endorsed by Razorpay.

For a condensed API reference designed for LLMs/coding agents, see [llms.md](llms.md).

## Install

```bash
npm install razorpayx-sdk
```

## Quick start

```ts
import { RazorpayX } from "razorpayx-sdk";

const client = new RazorpayX({
  keyId: process.env.RAZORPAYX_KEY_ID!,
  keySecret: process.env.RAZORPAYX_KEY_SECRET!,
});

const contact = await client.contacts.create({
  name: "Gaurav Kumar",
  email: "gaurav.kumar@example.com",
  contact: "9123456789",
  type: "employee",
});

const fundAccount = await client.fundAccounts.create({
  contact_id: contact.id,
  account_type: "bank_account",
  bank_account: {
    name: "Gaurav Kumar",
    ifsc: "HDFC0009107",
    account_number: "50100102283912",
  },
});

const payout = await client.payouts.create(
  {
    account_number: "7878780080316316",
    fund_account_id: fundAccount.id,
    amount: 100000, // in paise (₹1,000.00)
    currency: "INR",
    mode: "IMPS",
    purpose: "refund",
    queue_if_low_balance: true,
  },
  crypto.randomUUID(), // idempotency key, sent as X-Payout-Idempotency
);
```

CommonJS works the same way:

```js
const { RazorpayX } = require("razorpayx-sdk");
```

## Configuration

```ts
new RazorpayX({
  keyId: string,      // required — API Key ID
  keySecret: string,  // required — API Key Secret
  baseUrl?: string,    // default: "https://api.razorpay.com/v1/"
  timeout?: number,    // default: 30000 (ms)
});
```

Keys are read from wherever you choose to load them (e.g. `process.env`) — the SDK does not read environment variables itself.

## Resources

Every method returns a `Promise` that resolves with the parsed JSON response, or rejects with a [`RazorpayXError`](#error-handling).

### Contacts

```ts
await client.contacts.create({ name, email, contact, type, reference_id, notes });
await client.contacts.fetch(contactId);
await client.contacts.update(contactId, { name, email, ... });
await client.contacts.activate(contactId);
await client.contacts.deactivate(contactId);
await client.contacts.all({ count, skip, active, ... });
```

### Fund Accounts

```ts
await client.fundAccounts.create({
  contact_id,
  account_type: "bank_account", // or "vpa" | "card"
  bank_account: { name, ifsc, account_number },
});
await client.fundAccounts.fetch(fundAccountId);
await client.fundAccounts.activate(fundAccountId);
await client.fundAccounts.deactivate(fundAccountId);
await client.fundAccounts.all({ contact_id, count, skip });
```

### Payouts

```ts
// Payout to an existing fund account
await client.payouts.create(
  { account_number, fund_account_id, amount, currency: "INR", mode, purpose },
  idempotencyKey, // optional, sent as X-Payout-Idempotency
);

// Composite API: create the contact + fund account and pay out in one call
await client.payouts.createComposite({
  account_number,
  amount,
  currency: "INR",
  mode: "UPI",
  purpose: "refund",
  fund_account: {
    account_type: "vpa",
    vpa: { address: "gaurav@exampleupi" },
    contact: { name: "Gaurav Kumar", type: "employee" },
  },
});

await client.payouts.fetch(payoutId);
await client.payouts.cancel(payoutId); // only payouts in the `queued` state can be cancelled
await client.payouts.all({ account_number, status, mode, count, skip });
```

### Payout Links

```ts
await client.payoutLinks.create({
  account_number,
  contact: { name, contact, email }, // or { id: contactId }
  amount,
  currency: "INR",
  purpose: "refund",
});
await client.payoutLinks.fetch(payoutLinkId);
await client.payoutLinks.cancel(payoutLinkId);
await client.payoutLinks.all({ account_number, contact_id, count, skip });
```

### Transactions

```ts
await client.transactions.all({ account_number, count, skip, from, to });
await client.transactions.fetch(transactionId);
```

### Account Validation (Fund Account Validation)

```ts
await client.accountValidation.create({
  account_number,
  fund_account: { id: fundAccountId },
  amount: 100,
});
await client.accountValidation.fetch(validationId);
await client.accountValidation.all({ count, skip });
```

### Balances

```ts
await client.balances.fetch({ account_number });
```

## Error handling

API errors are thrown as a `RazorpayXError`, which carries the fields Razorpay returns in its `error` object:

```ts
import { RazorpayXError } from "razorpayx-sdk";

try {
  await client.payouts.create({ ... });
} catch (err) {
  if (err instanceof RazorpayXError) {
    console.error(err.statusCode, err.code, err.message, err.reason);
  } else {
    throw err;
  }
}
```

## Development

```bash
npm install
npm run build       # bundle to dist/ (ESM + CJS + .d.ts)
npm test            # run the test suite
npm run typecheck
npm run lint
```

## License

MIT
