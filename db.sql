DROP DATABASE IF EXISTS api_development;
CREATE DATABASE api_development;

\c api_development;

CREATE TABLE messages (
  ID SERIAL PRIMARY KEY,
  content VARCHAR,
  author VARCHAR,
  created_at TIMESTAMP without time zone default (now() at time zone 'utc')
);

INSERT INTO messages ( content, author )
VALUES ( 'Test', 'fake-name');

INSERT INTO messages ( content, author )
VALUES ( 'Test2', 'fake-name');

