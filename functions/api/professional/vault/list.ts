interface Env {
  SPINE_DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const clientId = url.searchParams.get("clientId");
  if (!clientId) {
    return Response.json({ error: "clientId required" }, { status: 400 });
  }
  const { results } = await context.env.SPINE_DB.prepare(
    `SELECT id, client_id as clientId, document_type as documentType, filing_year as filingYear,
            encryption_status as encryptionStatus, r2_key as r2Key, size_bytes as sizeBytes, uploaded_at as uploadedAt
     FROM document_metadata WHERE client_id = ? ORDER BY uploaded_at DESC`,
  )
    .bind(clientId)
    .all();
  return Response.json({ documents: results ?? [] });
};
