import type { DocumentMetadata, DocumentType, EncryptionStatus } from "./types";

export function clientVaultPrefix(clientId: string, professionalId: string): string {
  return `vault/${professionalId}/${clientId}`;
}

export function buildR2Key(
  clientId: string,
  professionalId: string,
  documentType: DocumentType,
  filingYear: number,
  fileName: string,
): string {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${clientVaultPrefix(clientId, professionalId)}/${filingYear}/${documentType}/${safe}`;
}

export function createDocumentMetadata(
  clientId: string,
  documentType: DocumentType,
  filingYear: number,
  professionalId: string,
  fileName: string,
  sizeBytes: number,
): DocumentMetadata {
  return {
    id: `doc-${crypto.randomUUID()}`,
    clientId,
    documentType,
    filingYear,
    encryptionStatus: "encrypted" as EncryptionStatus,
    r2Key: buildR2Key(clientId, professionalId, documentType, filingYear, fileName),
    sizeBytes,
    uploadedAt: new Date().toISOString(),
  };
}
