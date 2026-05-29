-- RutaSec MVP - Initial D1 schema
-- Stack assumptions:
-- - Better Auth for identity/session layer
-- - D1 for product data
-- - Public catalog, protected personal actions

PRAGMA foreign_keys = ON;

-- =========================
-- app users
-- =========================

CREATE TABLE IF NOT EXISTS app_users (
  id TEXT PRIMARY KEY,
  auth_user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_app_users_auth_user_id ON app_users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);

-- =========================
-- canonical resource catalog
-- =========================

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT NOT NULL,

  phase TEXT NOT NULL,
  category TEXT NOT NULL,
  topic TEXT NOT NULL,
  subtopic TEXT,

  resource_type TEXT NOT NULL CHECK (
    resource_type IN ('course', 'book', 'documentation', 'video', 'lab', 'tool', 'article')
  ),
  level TEXT NOT NULL CHECK (
    level IN ('beginner', 'intermediate', 'advanced')
  ),
  estimated_hours REAL NOT NULL CHECK (estimated_hours >= 0),

  original_source_name TEXT NOT NULL,
  original_source_url TEXT NOT NULL,
  curated_from_name TEXT NOT NULL,
  curated_from_url TEXT NOT NULL,
  roadmap_section TEXT NOT NULL,

  is_free INTEGER NOT NULL DEFAULT 1 CHECK (is_free IN (0, 1)),
  language TEXT,

  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  link_status TEXT NOT NULL DEFAULT 'unknown' CHECK (
    link_status IN ('unknown', 'ok', 'broken', 'redirected')
  ),
  imported_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resources_phase ON resources(phase);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_topic ON resources(topic);
CREATE INDEX IF NOT EXISTS idx_resources_level ON resources(level);
CREATE INDEX IF NOT EXISTS idx_resources_resource_type ON resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_is_published ON resources(is_published);

-- Optional lightweight search support for MVP.
CREATE INDEX IF NOT EXISTS idx_resources_title ON resources(title);

-- =========================
-- tags
-- =========================

CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resource_tags (
  resource_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (resource_id, tag_id),
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_resource_tags_tag_id ON resource_tags(tag_id);

-- =========================
-- curated paths (optional but useful)
-- =========================

CREATE TABLE IF NOT EXISTS learning_paths (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  is_featured INTEGER NOT NULL DEFAULT 0 CHECK (is_featured IN (0, 1)),
  is_published INTEGER NOT NULL DEFAULT 1 CHECK (is_published IN (0, 1)),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS learning_path_items (
  id TEXT PRIMARY KEY,
  learning_path_id TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  item_order INTEGER NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (learning_path_id) REFERENCES learning_paths(id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  UNIQUE (learning_path_id, item_order),
  UNIQUE (learning_path_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_learning_path_items_path ON learning_path_items(learning_path_id);
CREATE INDEX IF NOT EXISTS idx_learning_path_items_resource ON learning_path_items(resource_id);

-- =========================
-- personal library / progress
-- =========================

CREATE TABLE IF NOT EXISTS user_resources (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (
    status IN ('pending', 'in_progress', 'completed', 'discarded')
  ),
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (
    progress_percentage >= 0 AND progress_percentage <= 100
  ),
  notes TEXT,
  started_at TEXT,
  completed_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  UNIQUE (user_id, resource_id)
);

CREATE INDEX IF NOT EXISTS idx_user_resources_user_id ON user_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_user_resources_resource_id ON user_resources(resource_id);
CREATE INDEX IF NOT EXISTS idx_user_resources_status ON user_resources(status);

-- =========================
-- goals
-- =========================

CREATE TABLE IF NOT EXISTS goals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date TEXT,
  hours_per_week REAL NOT NULL CHECK (hours_per_week > 0),
  status TEXT NOT NULL CHECK (status IN ('active', 'completed', 'paused')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON goals(status);

CREATE TABLE IF NOT EXISTS goal_resources (
  goal_id TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  PRIMARY KEY (goal_id, resource_id),
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_goal_resources_resource_id ON goal_resources(resource_id);

-- =========================
-- study plans / timeline
-- =========================

CREATE TABLE IF NOT EXISTS study_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  goal_id TEXT NOT NULL,
  title TEXT NOT NULL,
  total_estimated_hours REAL NOT NULL DEFAULT 0 CHECK (total_estimated_hours >= 0),
  estimated_weeks REAL NOT NULL DEFAULT 0 CHECK (estimated_weeks >= 0),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  generated_by TEXT NOT NULL DEFAULT 'system' CHECK (generated_by IN ('system', 'user')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES app_users(id) ON DELETE CASCADE,
  FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_study_plans_user_id ON study_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_study_plans_goal_id ON study_plans(goal_id);

CREATE TABLE IF NOT EXISTS study_plan_items (
  id TEXT PRIMARY KEY,
  study_plan_id TEXT NOT NULL,
  resource_id TEXT NOT NULL,
  item_order INTEGER NOT NULL,
  week_number INTEGER NOT NULL CHECK (week_number > 0),
  estimated_start_date TEXT,
  estimated_end_date TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (study_plan_id) REFERENCES study_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
  UNIQUE (study_plan_id, item_order)
);

CREATE INDEX IF NOT EXISTS idx_study_plan_items_plan_id ON study_plan_items(study_plan_id);
CREATE INDEX IF NOT EXISTS idx_study_plan_items_resource_id ON study_plan_items(resource_id);
CREATE INDEX IF NOT EXISTS idx_study_plan_items_week_number ON study_plan_items(week_number);

-- =========================
-- imports / curation audit
-- =========================

CREATE TABLE IF NOT EXISTS resource_imports (
  id TEXT PRIMARY KEY,
  source_name TEXT NOT NULL,
  source_url TEXT NOT NULL,
  import_type TEXT NOT NULL CHECK (import_type IN ('manual', 'seed', 'script')),
  imported_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL
);
