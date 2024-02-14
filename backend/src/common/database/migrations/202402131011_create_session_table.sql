CREATE TABLE IF NOT EXISTS "session"
(
	id UUID NOT NULL,
	name VARCHAR(128) NOT NULL,
	capabilities JSON NOT NULL DEFAULT '[]',
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP NOT NULL,
	current_scenario VARCHAR(128) NOT NULL,
	current_step VARCHAR(128) NOT NULL,
	CONSTRAINT pk_session PRIMARY KEY (id)
);
