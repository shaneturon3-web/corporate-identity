import {
  listClientsByStatus,
  sumBillableMinutes,
  sumBillableRecoveredCents,
} from "../../../src/lib/wrappers/professional/db";

interface Env {
  SPINE_DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const professionalId = url.searchParams.get("professionalId") ?? "pro-demo";
  const byStatus = await listClientsByStatus(context.env.SPINE_DB, professionalId);
  const billableMinutes = await sumBillableMinutes(context.env.SPINE_DB, professionalId);
  const billableRecoveredCents = await sumBillableRecoveredCents(
    context.env.SPINE_DB,
    professionalId,
  );
  const settings = await context.env.SPINE_DB.prepare(
    `SELECT lead_gen_active, admin_abyss_hours_saved FROM professional_settings WHERE professional_id = ?`,
  )
    .bind(professionalId)
    .first<{ lead_gen_active: number; admin_abyss_hours_saved: number }>();

  return Response.json({
    billableMinutes,
    billableRecoveredCents,
    adminAbyssHoursSaved: settings?.admin_abyss_hours_saved ?? 12,
    byStatus,
    leadGenActive: (settings?.lead_gen_active ?? 0) === 1,
  });
};
