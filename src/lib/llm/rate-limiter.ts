interface TokenBucket {
  tokens: number;
  lastRefill: number;
  maxTokens: number;
  refillRate: number; // tokens per second
}

const buckets: Map<string, TokenBucket> = new Map();

function getBucket(provider: string): TokenBucket {
  if (!buckets.has(provider)) {
    const maxTokens = provider === "gemini" ? 15 : 30; // RPM limits
    buckets.set(provider, {
      tokens: maxTokens,
      lastRefill: Date.now(),
      maxTokens,
      refillRate: maxTokens / 60, // Convert RPM to per-second
    });
  }
  return buckets.get(provider)!;
}

function refill(bucket: TokenBucket): void {
  const now = Date.now();
  const elapsed = (now - bucket.lastRefill) / 1000;
  bucket.tokens = Math.min(
    bucket.maxTokens,
    bucket.tokens + elapsed * bucket.refillRate
  );
  bucket.lastRefill = now;
}

export async function acquireToken(provider: string): Promise<void> {
  const bucket = getBucket(provider);
  refill(bucket);

  if (bucket.tokens >= 1) {
    bucket.tokens -= 1;
    return;
  }

  // Wait until a token is available
  const waitTime = ((1 - bucket.tokens) / bucket.refillRate) * 1000;
  await new Promise((resolve) => setTimeout(resolve, waitTime));
  bucket.tokens = 0;
  bucket.lastRefill = Date.now();
}

export function getAvailableTokens(provider: string): number {
  const bucket = getBucket(provider);
  refill(bucket);
  return bucket.tokens;
}
