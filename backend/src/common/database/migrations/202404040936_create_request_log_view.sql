CREATE VIEW request_log_view AS SELECT
	rl.id,
	rl.created_at,
	rl.scenario_id,
	rl.step_id,
	s.id AS session_id,
	s.name AS session_name,
	rl.env,
	rl.action,
	rl.success,
	rl.status,
	rl.req_body,
	rl.req_method,
	rl.req_url,
	rl.req_headers,
	rl.res_status,
	rl.res_headers,
	rl.res_body,
	rl.res_duration,
	rl.res_error,
	rl.validation_result
FROM request_log AS rl
LEFT JOIN session s ON s.id = rl.session_id;
