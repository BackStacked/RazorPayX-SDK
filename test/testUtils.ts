import { vi } from "vitest";

export interface MockCall {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
}

export function mockFetchJson(status: number, body: unknown) {
  const fn = vi.fn(async (_url: URL, _init: RequestInit) => {
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  });
  vi.stubGlobal("fetch", fn);
  return fn;
}

export function lastCall(fn: ReturnType<typeof vi.fn>): MockCall {
  const [url, init] = fn.mock.calls[fn.mock.calls.length - 1] as [URL, RequestInit];
  return {
    url: url.toString(),
    method: String(init.method),
    headers: init.headers as Record<string, string>,
    body: init.body ? JSON.parse(init.body as string) : undefined,
  };
}
