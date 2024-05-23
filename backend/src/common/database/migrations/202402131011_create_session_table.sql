CREATE TABLE IF NOT EXISTS "session"
(
	id UUID NOT NULL,
	name VARCHAR(128) NOT NULL,
	capabilities JSON NOT NULL,
	current_scenario VARCHAR(128) NULL,
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL,
	CONSTRAINT pk_session PRIMARY KEY (id)
);
