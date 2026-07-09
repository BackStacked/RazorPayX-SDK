import { RazorpayXError } from "./errors.js";

export type QueryValue = string | number | boolean | undefined | null;

export interface RequestOptions {
  query?: Record<string, QueryValue>;
  body?: unknown;
  headers?: Record<string, string>;
}

export class HttpClient {
  constructor(
    private readonly baseUrl: string,
    private readonly authHeader: string,
    private readonly timeout: number,
  ) {}

  async request<T>(method: string, path: string, options: RequestOptions = {}): Promise<T> {
    const url = new URL(path, this.baseUrl);

    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(url, {
        method,
        headers: {
          Authorization: this.authHeader,
          "Content-Type": "application/json",
          ...options.headers,
        },
        body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      const text = await res.text();
      const data = text.length > 0 ? JSON.parse(text) : undefined;

      if (!res.ok) {
        const errorBody: Record<string, unknown> =
          data && typeof data === "object" && "error" in data
            ? (data.error as Record<string, unknown>)
            : { description: res.statusText || `Request failed with status ${res.status}` };

        throw new RazorpayXError(res.status, {
          description: String(errorBody.description ?? "Unknown error"),
          code: errorBody.code as string | undefined,
          field: errorBody.field as string | null | undefined,
          source: errorBody.source as string | null | undefined,
          step: errorBody.step as string | null | undefined,
          reason: errorBody.reason as string | null | undefined,
          metadata: errorBody.metadata as Record<string, unknown> | undefined,
        });
      }

      return data as T;
    } catch (err) {
      if (err instanceof RazorpayXError) throw err;
      if (err instanceof Error && err.name === "AbortError") {
        throw new RazorpayXError(0, { description: `Request timed out after ${this.timeout}ms` });
      }
      throw err;
    } finally {
      clearTimeout(timer);
    }
  }
}
