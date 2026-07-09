export interface RazorpayXCollection<T> {
  entity: "collection";
  count: number;
  items: T[];
}

export interface ListParams {
  from?: number;
  to?: number;
  count?: number;
  skip?: number;
}

export type Notes = Record<string, string>;
