import { insertBillableEvent } from "../../../src/lib/wrappers/professional/db";
import type { BillableEvent } from "../../../src/lib/wrappers/professional/types";

interface Env {
  SPINE_DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const body = (await context.request.json()) as { events: BillableEvent[] };
  for (const evt of body.events ?? []) {
    await insertBillableEvent(context.env.SPINE_DB, evt);
  }
  return Response.json({ saved: body.events?.length ?? 0 });
};
