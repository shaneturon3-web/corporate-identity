-- CoreSpine initial schema (vertical-agnostic administrative substrate)

CREATE TABLE IF NOT EXISTS spine_entities (
  id TEXT PRIMARY KEY,
  vertical TEXT NOT NULL DEFAULT 'professional',
  lifecycle_status TEXT NOT NULL DEFAULT 'lead',
  display_name TEXT,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS intake_submissions (
  id TEXT PRIMARY KEY,
  entity_id TEXT,
  channel TEXT NOT NULL,
  step_index INTEGER NOT NULL DEFAULT 0,
  payload_json TEXT NOT NULL,
  qualification_tags TEXT,
  routed_to TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL,
  FOREIGN KEY (entity_id) REFERENCES spine_entities(id)
);

CREATE TABLE IF NOT EXISTS scheduling_slots (
  id TEXT PRIMARY KEY,
  entity_id TEXT,
  professional_id TEXT NOT NULL,
  session_type TEXT NOT NULL,
  starts_at TEXT NOT NULL,
  ends_at TEXT NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'America/Toronto',
  status TEXT NOT NULL DEFAULT 'open',
  created_at TEXT NOT NULL,
  FOREIGN KEY (entity_id) REFERENCES spine_entities(id)
);

CREATE TABLE IF NOT EXISTS billing_ledger (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'CAD',
  split_operator_pct INTEGER NOT NULL DEFAULT 33,
  split_professional_pct INTEGER NOT NULL DEFAULT 67,
  invoice_ref TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (entity_id) REFERENCES spine_entities(id)
);

CREATE TABLE IF NOT EXISTS crm_memory_nodes (
  id TEXT PRIMARY KEY,
  entity_id TEXT NOT NULL,
  source_type TEXT NOT NULL,
  content_json TEXT NOT NULL,
  density_score REAL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (entity_id) REFERENCES spine_entities(id)
);

CREATE TABLE IF NOT EXISTS orchestration_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_id TEXT NOT NULL,
  from_status TEXT,
  to_status TEXT NOT NULL,
  actor TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (entity_id) REFERENCES spine_entities(id)
);

CREATE INDEX IF NOT EXISTS idx_intake_entity ON intake_submissions(entity_id);
CREATE INDEX IF NOT EXISTS idx_slots_professional ON scheduling_slots(professional_id, starts_at);
CREATE INDEX IF NOT EXISTS idx_ledger_entity ON billing_ledger(entity_id);
CREATE INDEX IF NOT EXISTS idx_memory_entity ON crm_memory_nodes(entity_id);
