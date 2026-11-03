import { Router, type IRouter } from "express";
import { db, meWaitlistTable } from "@workspace/db";
import { JoinMeWaitlistBody, JoinMeWaitlistResponse } from "@workspace/api-zod";

const router: IRouter = Router();
const attempts = new Map<string, { count: number; resetAt: number }>();
const windowMs = 15 * 60 * 1000;
const receipt = JoinMeWaitlistResponse.parse({
  success: true,
  message: "You're on the list. We'll share Me launch updates with you.",
});

router.post("/me/waitlist", async (req, res): Promise<void> => {
  res.setHeader("Cache-Control", "no-store");
  const now = Date.now();
  for (const [key, value] of attempts) {
    if (value.resetAt <= now) attempts.delete(key);
  }
  // Include the address so visitors behind the shared reverse proxy do not
  // consume one another's signup allowance. Never persist the network address.
  const emailKey = typeof req.body?.email === "string"
    ? req.body.email.trim().toLowerCase().slice(0, 254)
    : "invalid";
  const key = `${req.ip ?? "unknown"}:${emailKey}`;
  const attempt = attempts.get(key);
  if (attempt && attempt.count >= 15) {
    res.setHeader("Retry-After", Math.ceil((attempt.resetAt - now) / 1000));
    res.status(429).json({ error: "Too many attempts. Please try again later." });
    return;
  }
  if (attempt) attempt.count += 1;
  else if (attempts.size < 10000) attempts.set(key, { count: 1, resetAt: now + windowMs });
  else {
    res.status(429).json({ error: "Too many attempts. Please try again later." });
    return;
  }

  const input = req.body && typeof req.body === "object"
    ? { ...req.body, email: typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : req.body.email }
    : req.body;
  const parsed = JoinMeWaitlistBody.safeParse(input);
  if (!parsed.success || parsed.data.consent !== true) {
    res.status(400).json({ error: "Enter a valid email and agree to receive Me launch updates." });
    return;
  }
  if (parsed.data.website) {
    res.json(receipt);
    return;
  }
  try {
    await db.insert(meWaitlistTable).values({
      email: parsed.data.email,
      consentVersion: "launch-updates-v1",
    }).onConflictDoNothing({ target: meWaitlistTable.email });
    res.json(receipt);
  } catch (err) {
    req.log.error({ err }, "Me waitlist signup failed");
    res.status(503).json({ error: "We couldn't save your signup. Please try again shortly." });
  }
});

export default router;
