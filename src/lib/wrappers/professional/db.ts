import type { BillableEvent, DocumentMetadata, ProfessionalClient, TaxFilingStatus } from "./types";

/** D1 row helpers for Pages Functions (professional_* tables). */
export async function insertClient(
  db: D1Database,
  client: ProfessionalClient,
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO professional_clients
       (client_id, professional_id, display_name, entity_type, tax_filing_status, pipeline_stage, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      client.clientId,
      client.professionalId,
      client.displayName,
      client.entityType,
      client.taxFilingStatus,
      client.pipelineStage,
      client.createdAt,
      client.updatedAt,
    )
    .run();
}

export async function insertDocument(db: D1Database, doc: DocumentMetadata): Promise<void> {
  await db
    .prepare(
      `INSERT INTO document_metadata
       (id, client_id, document_type, filing_year, encryption_status, r2_key, size_bytes, uploaded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      doc.id,
      doc.clientId,
      doc.documentType,
      doc.filingYear,
      doc.encryptionStatus,
      doc.r2Key ?? null,
      doc.sizeBytes ?? null,
      doc.uploadedAt ?? null,
    )
    .run();
}

export async function insertBillableEvent(db: D1Database, evt: BillableEvent): Promise<void> {
  await db
    .prepare(
      `INSERT INTO billable_events
       (event_id, professional_id, client_id, duration_minutes, extraction_source, description, amount_cents, invoiced, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      evt.eventId,
      evt.professionalId,
      evt.clientId ?? null,
      evt.durationMinutes,
      evt.extractionSource,
      evt.description ?? null,
      evt.amountCents ?? null,
      evt.invoiced ? 1 : 0,
      evt.createdAt,
    )
    .run();
}

export async function listClientsByStatus(
  db: D1Database,
  professionalId: string,
): Promise<{ status: TaxFilingStatus; count: number }[]> {
  const { results } = await db
    .prepare(
      `SELECT tax_filing_status as status, COUNT(*) as count
       FROM professional_clients WHERE professional_id = ?
       GROUP BY tax_filing_status`,
    )
    .bind(professionalId)
    .all<{ status: TaxFilingStatus; count: number }>();
  return results ?? [];
}

export async function sumBillableMinutes(
  db: D1Database,
  professionalId: string,
): Promise<number> {
  const row = await db
    .prepare(
      `SELECT COALESCE(SUM(duration_minutes), 0) as total FROM billable_events WHERE professional_id = ?`,
    )
    .bind(professionalId)
    .first<{ total: number }>();
  return row?.total ?? 0;
}

/** Billable capacity recovered at default $220/hr (cents). */
export async function sumBillableRecoveredCents(
  db: D1Database,
  professionalId: string,
  hourlyRateCents = 22000,
): Promise<number> {
  const minutes = await sumBillableMinutes(db, professionalId);
  return Math.round((minutes / 60) * hourlyRateCents);
}
