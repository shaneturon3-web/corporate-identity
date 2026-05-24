interface Env {
  SPINE_DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  let dbOk = false;
  try {
    const row = await context.env.SPINE_DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='spine_entities'",
    ).first();
    dbOk = !!row;
  } catch {
    dbOk = false;
  }

  return Response.json({
    service: "corespine",
    status: dbOk ? "ok" : "degraded",
    perimeter: "shaneturon.ca",
    modules: ["intake", "scheduling", "billing", "crm", "orchestration"],
    db: dbOk ? "connected" : "schema_pending",
    ts: new Date().toISOString(),
  });
};
