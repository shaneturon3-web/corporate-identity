import { createDocumentMetadata } from "../../../../src/lib/wrappers/professional/vault";
import { insertDocument } from "../../../../src/lib/wrappers/professional/db";
import type { DocumentType } from "../../../../src/lib/wrappers/professional/types";

interface Env {
  SPINE_DB: D1Database;
  PROSPINE_VAULT?: R2Bucket;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const body = (await context.request.json()) as {
    clientId: string;
    professionalId: string;
    documentType: DocumentType;
    filingYear: number;
    fileName: string;
    sizeBytes: number;
    contentBase64?: string;
  };

  const meta = createDocumentMetadata(
    body.clientId,
    body.documentType,
    body.filingYear,
    body.professionalId,
    body.fileName,
    body.sizeBytes,
  );

  if (context.env.PROSPINE_VAULT && body.contentBase64 && meta.r2Key) {
    const bytes = Uint8Array.from(atob(body.contentBase64), (c) => c.charCodeAt(0));
    await context.env.PROSPINE_VAULT.put(meta.r2Key, bytes, {
      customMetadata: { clientId: body.clientId, documentType: body.documentType },
    });
    meta.encryptionStatus = "encrypted";
  } else {
    meta.encryptionStatus = "pending";
  }

  await insertDocument(context.env.SPINE_DB, meta);
  return Response.json({
    ok: true,
    document: meta,
    r2Note: context.env.PROSPINE_VAULT ? "stored" : "metadata_only_enable_r2_in_dashboard",
  });
};
