interface Env {
  SPINE_DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  let dbOk = false;
  let healthcareSchema = false;
  try {
    const row = await context.env.SPINE_DB.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='healthcare_consent_records'",
    ).first();
    healthcareSchema = !!row;
    if (healthcareSchema) {
      await context.env.SPINE_DB.prepare(
        "SELECT 1 FROM healthcare_consent_records LIMIT 1",
      ).first();
    }
    dbOk = healthcareSchema;
  } catch {
    dbOk = false;
  }

  return Response.json({
    service: "psynova",
    status: dbOk ? "ok" : "degraded",
    perimeter: "psynova.shaneturon.ca",
    modules: ["intake", "consent", "clinical", "brand-mode"],
    db: dbOk ? "connected" : "schema_pending",
    ts: new Date().toISOString(),
  });
};
