DROP TABLE IF EXISTS companies;

CREATE TABLE IF NOT EXISTS companies (
  name TEXT UNIQUE,
  displayName TEXT,
  legalName TEXT,
  domain TEXT UNIQUE,
  description TEXT,
  location TEXT,
  foundedDate TEXT,
  url TEXT,
  logo TEXT,
  created TIMESTAMP WITHOUT TIME ZONE,
  id SERIAL PRIMARY KEY
);
