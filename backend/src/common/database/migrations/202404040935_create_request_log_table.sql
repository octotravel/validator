CREATE TABLE IF NOT EXISTS "request_log"
(
	id UUID NOT NULL,
	session_id UUID NOT NULL,
	scenario_id VARCHAR(128) NULL,
	step_id VARCHAR(128) NULL,
	created_at TIMESTAMP NOT NULL,
	env VARCHAR(10) NOT NULL,
	action VARCHAR(128) NULL,
	success BOOLEAN NOT NULL,
	status SMALLINT NOT NULL,
	req_body TEXT NULL DEFAULT '',
	req_method VARCHAR(6) NULL DEFAULT '',
	req_url VARCHAR(2048) NULL DEFAULT '',
	req_headers TEXT NULL DEFAULT '',
	res_status SMALLINT NOT NULL,
	res_headers TEXT NULL DEFAULT '',
	res_body TEXT NULL DEFAULT '',
	res_duration INT NULL,
	res_error TEXT NULL DEFAULT '',
	validation_result TEXT NULL DEFAULT '',
	CONSTRAINT fk_session_id FOREIGN KEY (session_id) REFERENCES "session" (id),
	CONSTRAINT pk_request_log PRIMARY KEY (id)
);

CREATE INDEX index_request_log_session_id ON request_log(session_id);
CREATE INDEX index_request_log_created_at ON request_log(created_at DESC);
CREATE INDEX index_request_log_scenario_id ON request_log(scenario_id);
CREATE INDEX index_request_log_step_id ON request_log(step_id);