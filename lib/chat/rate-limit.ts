import "server-only";

import { createHash } from "node:crypto";
import { chatConfig } from "./config";
import { incrementCounter } from "./store";

export type LimitResult = { ok: true } | { ok: false; status: 429 | 503; message: string; retryAfterSeconds: number };

/** IPs are hashed before use as keys, so raw addresses are never stored. */
function hashIp(ip: string) {
  return createHash("sha256").update(`portfolio-chat:${ip}`).digest("hex").slice(0, 24);
}

export async function checkLimits(ip: string): Promise<LimitResult> {
  const now = Math.floor(Date.now() / 1000);

  // 1) Per-visitor burst limit (fixed window)
  const ipWindow = Math.floor(now / chatConfig.perIpWindowSeconds);
  const ipCount = await incrementCounter(`chat:ip:${hashIp(ip)}:${ipWindow}`, chatConfig.perIpWindowSeconds);
  if (ipCount > chatConfig.perIpLimit) {
    return {
      ok: false,
      status: 429,
      message: "You're asking quickly — please wait a few minutes and try again.",
      retryAfterSeconds: (ipWindow + 1) * chatConfig.perIpWindowSeconds - now,
    };
  }

  // 2) Site-wide daily budget cap
  const day = new Date().toISOString().slice(0, 10);
  const dayCount = await incrementCounter(`chat:day:${day}`, 26 * 60 * 60);
  if (dayCount > chatConfig.dailyLimit) {
    const tomorrow = new Date();
    tomorrow.setUTCHours(24, 0, 0, 0);
    return {
      ok: false,
      status: 503,
      message: "The assistant has reached today's limit. Please email Gab directly — he'd love to hear from you.",
      retryAfterSeconds: Math.ceil((tomorrow.getTime() - Date.now()) / 1000),
    };
  }

  return { ok: true };
}
