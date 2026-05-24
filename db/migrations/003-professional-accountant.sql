-- Order 005: ProSpine Accountant — Light Shield (PIPEDA / professional privacy)

CREATE TABLE IF NOT EXISTS professional_clients (
  client_id TEXT PRIMARY KEY,
  professional_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  entity_type TEXT NOT NULL DEFAULT 'individual',
  tax_filing_status TEXT NOT NULL DEFAULT 'Discovery',
  pipeline_stage TEXT NOT NULL DEFAULT 'lead',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS document_metadata (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  document_type TEXT NOT NULL,
  filing_year INTEGER NOT NULL,
  encryption_status TEXT NOT NULL DEFAULT 'pending',
  r2_key TEXT,
  size_bytes INTEGER,
  uploaded_at TEXT,
  FOREIGN KEY (client_id) REFERENCES professional_clients(client_id)
);

CREATE TABLE IF NOT EXISTS billable_events (
  event_id TEXT PRIMARY KEY,
  professional_id TEXT NOT NULL,
  client_id TEXT,
  duration_minutes INTEGER NOT NULL,
  extraction_source TEXT NOT NULL,
  description TEXT,
  amount_cents INTEGER,
  invoiced INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (client_id) REFERENCES professional_clients(client_id)
);

CREATE INDEX IF NOT EXISTS idx_prof_clients_status ON professional_clients(tax_filing_status);
CREATE INDEX IF NOT EXISTS idx_docs_client ON document_metadata(client_id, filing_year);
CREATE INDEX IF NOT EXISTS idx_billable_prof ON billable_events(professional_id, created_at);

CREATE TABLE IF NOT EXISTS professional_settings (
  professional_id TEXT PRIMARY KEY,
  lead_gen_active INTEGER NOT NULL DEFAULT 0,
  admin_abyss_hours_saved REAL NOT NULL DEFAULT 12,
  updated_at TEXT NOT NULL
);
