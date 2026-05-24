/** ProSpine Accountant — Light Shield / Ghost Mode types */

export type TaxFilingStatus =
  | "Discovery"
  | "Documents_Pending"
  | "Review"
  | "Filed"
  | "Completed";

export type PipelineStage = "lead" | "discovery" | "document_collection" | "active";

export type DocumentType = "T4" | "Receipt" | "Bank_Statement" | "NOA" | "Other";

export type EncryptionStatus = "pending" | "encrypted" | "verified";

export type ExtractionSource = "email" | "call" | "manual" | "calendar";

export interface ProfessionalClient {
  clientId: string;
  professionalId: string;
  displayName: string;
  entityType: "individual" | "business";
  taxFilingStatus: TaxFilingStatus;
  pipelineStage: PipelineStage;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentMetadata {
  id: string;
  clientId: string;
  documentType: DocumentType;
  filingYear: number;
  encryptionStatus: EncryptionStatus;
  r2Key?: string;
  sizeBytes?: number;
  uploadedAt?: string;
}

export interface BillableEvent {
  eventId: string;
  professionalId: string;
  clientId?: string;
  durationMinutes: number;
  extractionSource: ExtractionSource;
  description?: string;
  amountCents?: number;
  invoiced: boolean;
  createdAt: string;
}
