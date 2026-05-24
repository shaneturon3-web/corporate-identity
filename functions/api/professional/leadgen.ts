interface Env {
  SPINE_DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const body = (await context.request.json()) as { professionalId: string; active: boolean };
  const ts = new Date().toISOString();
  await context.env.SPINE_DB.prepare(
    `INSERT INTO professional_settings (professional_id, lead_gen_active, admin_abyss_hours_saved, updated_at)
     VALUES (?, ?, 12, ?)
     ON CONFLICT(professional_id) DO UPDATE SET lead_gen_active = excluded.lead_gen_active, updated_at = excluded.updated_at`,
  )
    .bind(body.professionalId, body.active ? 1 : 0, ts)
    .run();
  return Response.json({ professionalId: body.professionalId, leadGenActive: body.active });
};
