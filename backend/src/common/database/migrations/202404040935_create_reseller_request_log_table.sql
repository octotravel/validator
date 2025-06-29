CREATE TABLE IF NOT EXISTS "reseller_request_log"
(
	id UUID NOT NULL,
	session_id UUID NOT NULL,
	scenario_id VARCHAR(128) NULL,
	step_id VARCHAR(128) NULL,
	created_at TIMESTAMP NOT NULL,
	req_body TEXT NULL DEFAULT '',
	req_method VARCHAR(6) NULL DEFAULT '',
	req_url VARCHAR(2048) NULL DEFAULT '',
	req_headers TEXT NULL DEFAULT '',
	res_status SMALLINT NOT NULL,
	res_headers TEXT NULL DEFAULT '',
	res_body TEXT NULL DEFAULT '',
	res_duration INT NULL,
	validation_result TEXT NULL DEFAULT '',
	is_valid BOOLEAN NOT NULL,
	has_correctly_answered_questions BOOLEAN NOT NULL,
	CONSTRAINT fk_session_id FOREIGN KEY (session_id) REFERENCES "session" (id),
	CONSTRAINT pk_reseller_request_log PRIMARY KEY (id)
);

CREATE INDEX index_request_log_session_id ON reseller_request_log(session_id);
CREATE INDEX index_request_log_scenario_id ON reseller_request_log(scenario_id);
CREATE INDEX index_request_log_step_id ON reseller_request_log(step_id);
CREATE INDEX index_request_log_created_at ON reseller_request_log(created_at DESC);
CREATE INDEX index_request_log_is_valid ON reseller_request_log(is_valid);
