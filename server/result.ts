/** Shared result contract for request processors (enrol, callback, …). */
export type ProcessResult =
  | { ok: true; status: 200 }
  | { ok: false; status: number; error: string; issues?: Record<string, string[] | undefined> };
