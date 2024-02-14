DO
$$

BEGIN
	SET statement_timeout = 0;
	SET lock_timeout = 0;
	SET idle_in_transaction_session_timeout = 0;
	SET client_encoding = 'UTF8';
	SET standard_conforming_strings = on;
	SET check_function_bodies = false;
	SET xmloption = content;
	SET client_min_messages = warning;
	SET row_security = off;
	SET default_tablespace = '';
	SET default_table_access_method = heap;

CREATE TABLE IF NOT EXISTS users (
	id INTEGER PRIMARY KEY,
	balance INTEGER,
	"limit" INTEGER
);

CREATE TABLE IF NOT EXISTS transactions (
	id SERIAL PRIMARY KEY,
	user_id INTEGER,
	"value" INTEGER,
	"type" VARCHAR(1),
	description VARCHAR(10),
	created TIMESTAMP,
	
	CONSTRAINT fk_users
      FOREIGN KEY(user_id) 
        REFERENCES users("id")
);


INSERT INTO users (id, "limit", balance)
VALUES
(1, 100000, 0),
(2, 80000, 0),
(3, 1000000, 0),
(4, 10000000, 0),
(5, 500000, 0);

END
$$;