DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;

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

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL DEFAULT currval('users_id_seq') UNIQUE,
  temp BOOLEAN NOT NULL DEFAULT FALSE
);
