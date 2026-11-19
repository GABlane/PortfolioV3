import "server-only";

/** Chat assistant settings. All secrets are read here, on the server only. */
export const chatConfig = {
  apiKey: process.env.GEMINI_API_KEY?.trim() || "",
  model: process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite",

  /** Per-visitor burst limit */
  perIpLimit: Number(process.env.CHAT_RATE_LIMIT_PER_IP) || 12,
  perIpWindowSeconds: 10 * 60,

  /** Site-wide daily budget cap — protects your Gemini bill from abuse */
  dailyLimit: Number(process.env.CHAT_DAILY_LIMIT) || 500,

  /** Identical first questions are answered once and reused */
  cacheTtlSeconds: 6 * 60 * 60,

  /** Request limits */
  maxBodyBytes: 16 * 1024,
  maxMessages: 12,
  maxCharsPerMessage: 600,
  maxTotalChars: 6000,
  maxOutputTokens: 700,
  requestTimeoutMs: 25_000,
} as const;

export function isChatEnabled() {
  return chatConfig.apiKey.length > 0;
}
