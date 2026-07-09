export interface RazorpayXErrorDetails {
  code?: string;
  description: string;
  field?: string | null;
  source?: string | null;
  step?: string | null;
  reason?: string | null;
  metadata?: Record<string, unknown>;
}

export class RazorpayXError extends Error {
  readonly statusCode: number;
  readonly code?: string;
  readonly field?: string | null;
  readonly source?: string | null;
  readonly step?: string | null;
  readonly reason?: string | null;
  readonly metadata?: Record<string, unknown>;

  constructor(statusCode: number, details: RazorpayXErrorDetails) {
    super(details.description);
    this.name = "RazorpayXError";
    this.statusCode = statusCode;
    this.code = details.code;
    this.field = details.field;
    this.source = details.source;
    this.step = details.step;
    this.reason = details.reason;
    this.metadata = details.metadata;
    Object.setPrototypeOf(this, RazorpayXError.prototype);
  }
}
