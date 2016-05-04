DROP TABLE IF EXISTS users_companies;
DROP TABLE IF EXISTS companies;
DROP TABLE IF EXISTS users;

DROP TABLE IF EXISTS jobs;

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
  twitter TEXT,
  linkedin TEXT,
  facebook TEXT,
  created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  id BIGSERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL DEFAULT currval('users_id_seq') UNIQUE,
  temp BOOLEAN NOT NULL DEFAULT FALSE,
  created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users_companies (
  user_id INT REFERENCES users,
  company_id INT REFERENCES companies,
  created TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, company_id)
);

CREATE TABLE IF NOT EXISTS jobs (
  title TEXT,
  url TEXT,
  description TEXT,
  visa_sponsored BOOLEAN,
  remote_ok BOOLEAN,
  relocation BOOLEAN,
  salary INT,
  created TEXT,
  city TEXT,
  id BIGSERIAL PRIMARY KEY,
  company_id INT REFERENCES companies
);
