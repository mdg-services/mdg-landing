/**
 * Development-only structural check between the two dictionaries.
 *
 * TypeScript already proves that every key in English exists in Hindi with
 * the same type. What it cannot prove is that a list has the same number of
 * entries in both, because an array of three and an array of two have the
 * same type. A missing sixth promise would otherwise ship silently, so this
 * walks both trees and shouts in the console during development.
 */
export function checkParity(en: unknown, hi: unknown, path = "dict"): string[] {
  const problems: string[] = [];

  if (Array.isArray(en) || Array.isArray(hi)) {
    if (!Array.isArray(en) || !Array.isArray(hi)) {
      problems.push(`${path}: one language has a list here and the other does not`);
      return problems;
    }
    if (en.length !== hi.length) {
      problems.push(`${path}: ${en.length} entries in English, ${hi.length} in Hindi`);
    }
    for (let i = 0; i < Math.min(en.length, hi.length); i++) {
      problems.push(...checkParity(en[i], hi[i], `${path}[${i}]`));
    }
    return problems;
  }

  if (isPlainObject(en) && isPlainObject(hi)) {
    for (const key of Object.keys(en)) {
      if (!(key in hi)) problems.push(`${path}.${key}: missing in Hindi`);
      else problems.push(...checkParity(en[key], hi[key], `${path}.${key}`));
    }
    for (const key of Object.keys(hi)) {
      if (!(key in en)) problems.push(`${path}.${key}: present in Hindi but not in English`);
    }
    return problems;
  }

  if (typeof en === "string" && typeof hi === "string" && hi.trim() === "") {
    problems.push(`${path}: empty Hindi string`);
  }
  return problems;
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
