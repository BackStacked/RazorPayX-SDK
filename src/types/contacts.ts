import type { ListParams, Notes } from "./common.js";

export type ContactType = "employee" | "vendor" | "customer" | "self";

export interface Contact {
  id: string;
  entity: "contact";
  name: string | null;
  contact: string | null;
  email: string | null;
  type: ContactType | null;
  reference_id: string | null;
  batch_id: string | null;
  active: boolean;
  notes: Notes | [];
  created_at: number;
}

export interface CreateContactParams {
  name?: string;
  email?: string;
  contact?: string | number;
  type?: ContactType;
  reference_id?: string;
  notes?: Notes;
}

export interface UpdateContactParams {
  name?: string;
  email?: string;
  contact?: string | number;
  type?: ContactType;
  reference_id?: string;
  notes?: Notes;
  active?: boolean;
}

export interface ListContactsParams extends ListParams {
  name?: string;
  email?: string;
  contact?: string;
  reference_id?: string;
  active?: boolean;
}
