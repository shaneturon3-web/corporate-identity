-- PsyNova Layer 2 — consent audit & zone access (Law 25 perimeter)

CREATE TABLE IF NOT EXISTS healthcare_consent_records (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  consent_type TEXT NOT NULL,
  signed_at TEXT NOT NULL,
  signer_name TEXT NOT NULL,
  signature_hash TEXT NOT NULL,
  ip_address TEXT,
  locale TEXT DEFAULT 'fr-CA',
  payload_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (entity_id) REFERENCES spine_entities(id)
);

CREATE TABLE IF NOT EXISTS healthcare_access_audit (
  id TEXT PRIMARY KEY,
  actor_id TEXT NOT NULL,
  role_zone TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  action TEXT NOT NULL,
  allowed INTEGER NOT NULL,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS healthcare_marketing_leads (
  id TEXT PRIMARY KEY,
  channel TEXT NOT NULL,
  external_id TEXT,
  fit_score REAL,
  fit_blockers_json TEXT,
  routed_professional_id TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  payload_json TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_consent_entity ON healthcare_consent_records(entity_id);
CREATE INDEX IF NOT EXISTS idx_leads_channel ON healthcare_marketing_leads(channel, status);
