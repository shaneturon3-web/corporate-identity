import { insertClient } from "../../../src/lib/wrappers/professional/db";
import type { ProfessionalClient } from "../../../src/lib/wrappers/professional/types";

interface Env {
  SPINE_DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const body = (await context.request.json()) as Partial<ProfessionalClient> & {
    clientId: string;
    professionalId: string;
    displayName: string;
    entityType: string;
    taxFilingStatus: string;
    pipelineStage: string;
  };
  const ts = new Date().toISOString();
  const client: ProfessionalClient = {
    clientId: body.clientId,
    professionalId: body.professionalId,
    displayName: body.displayName,
    entityType: body.entityType as "individual" | "business",
    taxFilingStatus: body.taxFilingStatus as ProfessionalClient["taxFilingStatus"],
    pipelineStage: body.pipelineStage as ProfessionalClient["pipelineStage"],
    createdAt: ts,
    updatedAt: ts,
  };
  await insertClient(context.env.SPINE_DB, client);
  await context.env.SPINE_DB.prepare(
    `INSERT INTO professional_settings (professional_id, lead_gen_active, admin_abyss_hours_saved, updated_at)
     VALUES (?, 0, 12, ?) ON CONFLICT(professional_id) DO NOTHING`,
  )
    .bind(body.professionalId, ts)
    .run();
  return Response.json({ ok: true, client });
};
