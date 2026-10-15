/**
 * "Now", for the guides' release schedule. The real clock, unless
 * GUIDE_FAKE_NOW is set to a date ("2026-10-20T12:00:00Z"): a way to look at the
 * guide as it will be on another day, for checking the daily growth before it
 * happens. Never set it in production.
 */
export function guideNow(): Date {
  const fake = process.env.GUIDE_FAKE_NOW;
  if (fake) {
    const d = new Date(fake);
    if (!Number.isNaN(d.getTime())) return d;
  }
  return new Date();
}
