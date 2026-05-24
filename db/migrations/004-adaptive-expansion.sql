-- Order 021–027: Adaptive gallery, RBAC metadata, expansion seeds

CREATE TABLE IF NOT EXISTS project_data (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'FUTURE',
  layer INTEGER NOT NULL DEFAULT 2,
  category TEXT,
  architecture_json TEXT NOT NULL DEFAULT '[]',
  href TEXT NOT NULL,
  permission_level TEXT NOT NULL DEFAULT 'PUBLIC',
  hidden INTEGER NOT NULL DEFAULT 0,
  draft INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 99,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS module_config (
  id TEXT PRIMARY KEY,
  project_slug TEXT NOT NULL,
  module_key TEXT NOT NULL,
  config_json TEXT NOT NULL,
  enabled INTEGER NOT NULL DEFAULT 1,
  FOREIGN KEY (project_slug) REFERENCES project_data(slug)
);

CREATE INDEX IF NOT EXISTS idx_project_data_visible
  ON project_data(hidden, draft, sort_order);

CREATE INDEX IF NOT EXISTS idx_module_config_slug
  ON module_config(project_slug, module_key);

-- D1-only gallery card (no redeploy when adding rows like this)
INSERT OR IGNORE INTO project_data (
  slug, title, tagline, status, layer, category,
  architecture_json, href, permission_level, hidden, draft, sort_order, created_at, updated_at
) VALUES (
  'd1-orchestrator-demo',
  'D1 Orchestrator (Live)',
  'Gallery card sourced from project_data — no static markdown required.',
  'PILOT',
  2,
  'Expansion',
  '["Adaptive renderer","module_config binding","RBAC permission gate"]',
  '/projects/d1-orchestrator-demo/',
  'PUBLIC',
  0,
  0,
  50,
  datetime('now'),
  datetime('now')
);

INSERT OR IGNORE INTO module_config (id, project_slug, module_key, config_json, enabled)
VALUES (
  'mod-d1-demo-dashboard',
  'd1-orchestrator-demo',
  'dashboard',
  '{"widgets":["status","module_health"],"theme":"restrained-dark"}',
  1
);

-- Hidden associate holdings (BACKEND_ADMIN only)
INSERT OR IGNORE INTO project_data (
  slug, title, tagline, status, layer, category,
  architecture_json, href, permission_level, hidden, draft, sort_order, created_at, updated_at
) VALUES (
  'associate-holdings',
  'Associate Compensation Matrix',
  'Administrator share, lead fees, referral commissions — backend only.',
  'NOW',
  1,
  'Internal',
  '["compensation-matrix.ts","Secret holding logic"]',
  '/internal/associate/',
  'BACKEND',
  1,
  0,
  1,
  datetime('now'),
  datetime('now')
);
