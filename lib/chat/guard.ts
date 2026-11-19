import "server-only";

/**
 * Topic guard for the portfolio assistant.
 *
 * Layer 1 (here, before any model call): refuse obvious off-topic input for free —
 *   bare maths/symbols, romantic/explicit/abusive messages, and prompt-injection phrasing.
 * Layer 2 (in the system rules): for anything else that isn't about Gab, the model must
 *   reply with only OFF_TOPIC_SENTINEL; the route swaps that for OFF_TOPIC_REPLY so the
 *   model never improvises an off-topic answer.
 */

export const OFF_TOPIC_SENTINEL = "[OFF_TOPIC]";

export const OFF_TOPIC_REPLY =
  "I can only answer questions about Gab — his projects, skills, experience, and how to reach him. Try one of the suggested questions below.";

const MATH_ONLY = /^[\s\d+\-*/×÷^().,=%xX?]+$/;
const INAPPROPRIATE =
  /\b(sexy|sex|nudes?|naked|horny|porn\w*|onlyfans|date me|marry me|be my (?:girlfriend|boyfriend|bf|gf)|love you|fuck\w*|shit\w*|bitch\w*|dick|pussy|ass(?:hole)?|slut|whore)\b/i;
// Lowercase only, so "KISS principle" still counts as a real question
const KISS = /\bkiss(?:es|ing)?\b/;
const INJECTION =
  /(ignore (?:all |any |the |your )?(?:previous |prior |above )?(?:instructions|rules|prompt)|system prompt|developer mode|jailbreak|you are now|pretend (?:to be|you(?:'re| are))|roleplay|role-play|reveal (?:your|the) (?:rules|instructions|prompt))/i;

/** Returns true when the message should be refused without calling the model. */
export function isClearlyOffTopic(message: string): boolean {
  const text = message.trim();
  if (text.length < 2) return true;
  if (MATH_ONLY.test(text) && /\d/.test(text)) return true;
  if (INAPPROPRIATE.test(text) || KISS.test(text)) return true;
  if (INJECTION.test(text)) return true;
  return false;
}
