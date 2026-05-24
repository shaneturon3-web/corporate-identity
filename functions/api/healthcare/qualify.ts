import { processBrandModeLead, type MarketingLead } from "../../../src/lib/wrappers/healthcare/brand-mode-pipeline";

interface Env {
  SPINE_DB: D1Database;
}

const DEMO_PROFESSIONALS = [
  { id: "psych-01", tags: ["referral", "standard", "brand_mode"] },
];

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: Partial<MarketingLead>;
  try {
    body = await context.request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const lead: MarketingLead = {
    id: body.id ?? `lead-${crypto.randomUUID()}`,
    channel: (body.channel as MarketingLead["channel"]) ?? "web",
    externalId: body.externalId ?? "",
    rawPayload: body.rawPayload ?? {},
    receivedAt: new Date().toISOString(),
  };

  const result = processBrandModeLead(lead, DEMO_PROFESSIONALS);

  return Response.json({
    leadId: lead.id,
    fit: result.fit,
    route: result.route,
    intakeChannel: result.intake.channel,
  });
};
