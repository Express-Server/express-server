PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE messages (id integer PRIMARY KEY, timestamp datetime DEFAULT CURRENT_TIMESTAMP, text text NOT NULL, user_id INTEGER REFERENCES users (id) NOT NULL);
CREATE TABLE users (id integer PRIMARY KEY, name text NOT NULL, password_hash STRING UNIQUE, salt STRING UNIQUE);
COMMIT;
