/**
 * One place to name the model.
 *
 * Every model-backed route went down at once when the AI Gateway account ran
 * out of credit, and finding that meant reading three files. Pointing them all
 * at one env var means switching provider or tier is a redeploy, not an edit.
 */
export const MODEL = process.env.OPS_MODEL ?? "anthropic/claude-sonnet-5";

/**
 * The gateway's restriction error is a 403 dressed up as a generic failure, and
 * the message is the only reliable signal. Worth naming, because "draft failed,
 * try again" sends you looking for a bug in the prompt.
 */
export function isBillingError(err: unknown): boolean {
  const s = String((err as { message?: string })?.message ?? err);
  return /free tier|no_providers_available|insufficient|quota|credit/i.test(s);
}
