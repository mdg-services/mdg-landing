/**
 * A short memory of recent events per key (an address, a phone number), kept
 * by this one server copy.
 *
 * Vercel runs the API as several copies that come and go and share nothing, so
 * this cannot promise an exact count: it stops a flood that keeps landing on
 * the same copy, which is what one script in a loop does. The exact per-address
 * limit is the firewall rule in MANUAL_STEPS.md.
 */
export class RecentLog {
  private readonly hits = new Map<string, number[]>();
  private readonly windowMs: number;
  /** Bounds the memory a flood from many addresses can take. */
  private readonly maxKeys: number;

  constructor(windowMs: number, maxKeys = 5000) {
    this.windowMs = windowMs;
    this.maxKeys = maxKeys;
  }

  /** How many times `key` was recorded within the window ending at `now`. */
  count(key: string, now: number): number {
    const kept = (this.hits.get(key) ?? []).filter((t) => now - t < this.windowMs);
    if (kept.length) this.hits.set(key, kept);
    else this.hits.delete(key);
    return kept.length;
  }

  /** Record one event for `key` at `now`. Returns a function that takes it back. */
  add(key: string, now: number): () => void {
    if (!this.hits.has(key) && this.hits.size >= this.maxKeys) this.makeRoom(now);
    const list = this.hits.get(key) ?? [];
    list.push(now);
    this.hits.set(key, list);
    return () => {
      const current = this.hits.get(key);
      const i = current ? current.lastIndexOf(now) : -1;
      if (!current || i < 0) return;
      current.splice(i, 1);
      if (!current.length) this.hits.delete(key);
    };
  }

  private makeRoom(now: number): void {
    for (const [key, list] of this.hits) {
      if (!list.some((t) => now - t < this.windowMs)) this.hits.delete(key);
    }
    // Still full of live keys: forget the oldest. Under a flood that wide the
    // firewall is what holds the line, not this.
    for (const key of this.hits.keys()) {
      if (this.hits.size < this.maxKeys) break;
      this.hits.delete(key);
    }
  }
}

/**
 * The key a visitor's address is counted under. An IPv4 address as it is. An
 * IPv6 address by its first four groups: a phone line or home connection is
 * handed a whole block of 2^64 addresses, and the rest is its owner's to change
 * at will, so counting the full address would let one sender be anyone.
 */
export function addressKey(ip: string): string {
  const raw = ip.trim().toLowerCase();
  if (!raw.includes(":")) return raw;
  // An IPv4 address written the IPv6 way.
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(raw);
  if (mapped) return mapped[1];
  const [head, tail] = raw.split("::");
  const front = head ? head.split(":") : [];
  const back = tail ? tail.split(":") : [];
  const groups =
    tail === undefined ? front : [...front, ...Array<string>(Math.max(0, 8 - front.length - back.length)).fill("0"), ...back];
  return groups
    .slice(0, 4)
    .map((g) => g.replace(/^0+(?=.)/, ""))
    .join(":") + "::/64";
}
