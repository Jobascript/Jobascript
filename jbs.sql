DROP TABLE IF EXISTS companies;

CREATE TABLE IF NOT EXISTS companies (
  name TEXT UNIQUE,
  display_name TEXT,
  legal_name TEXT,
  domain TEXT UNIQUE,
  description TEXT,
  location TEXT,
  founded_date TEXT,
  url TEXT,
  logo TEXT,
  created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  id BIGSERIAL PRIMARY KEY
);
